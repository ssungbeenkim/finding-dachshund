import { Field, ItemType } from './field.js';
import * as sound from './sound.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

export class GameBuilder {
  withGameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }
  withPuppyCount(num) {
    this.puppyCount = num;
    return this;
  }
  withHotdogCount(num) {
    this.hotdogCount = num;
    return this;
  }

  build() {
    return new Game(this.gameDuration, this.puppyCount, this.hotdogCount);
  }
}

class Game {
  constructor(gameDuration, puppyCount, hotdogCount) {
    this.gameDuration = gameDuration;
    this.puppyCount = puppyCount;
    this.hotdogCount = hotdogCount;
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameLevel = document.querySelector('.game__level');
    this.gameBtn = document.querySelector('.game__button');
    this.gameBtn.addEventListener('click', () => {
      if (this.started) {
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });
    this.gameField = new Field(this.puppyCount, this.hotdogCount);
    this.gameField.setClickListener(this.onItemClick);
    this.started = false;
    this.score = 0;
    this.timer = undefined;
    this.remainingTimeSec = this.gameDuration;
    this.level = 1;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.initGame();
    this.updateLevel();
    this.showStopBtnAndLevel();
    this.showTimerAndScore();
    this.startGameTimer(this.gameDuration);
    sound.playBackground();
  }

  restart(initPuppy, initHotdog) {
    this.puppyCount = initPuppy;
    this.hotdogCount = initHotdog;
    this.level = 1;
    this.initGameField();
    this.start();
  }

  startNext() {
    this.stopGameTimer();
    this.onGameStop && this.onGameStop(Reason.win);
    this.stageUp();
    this.updateLevel();
    this.initGameField();
    this.initGame();
    this.startGameTimer(this.gameDuration);
  }

  stageUp() {
    this.level++;
    this.puppyCount += 3;
    this.hotdogCount += 3;
  }

  updateLevel() {
    this.gameLevel.innerText = `lv.${this.level}`;
  }

  stop(reason) {
    const playTime = this.gameDuration - this.remainingTimeSec;
    this.started = false;
    this.stopGameTimer();
    this.hideGameLevelScoreTimer();
    this.onGameStop &&
      this.onGameStop(reason, this.level, this.score, playTime);
    sound.stopBackground();
  }

  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === ItemType.puppy) {
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.puppyCount) {
        this.startNext();
      }
    } else if (item === ItemType.hotdog) {
      this.stop(Reason.lose);
    }
  };

  showStopBtnAndLevel() {
    const icon = this.gameBtn.querySelector('.fa-solid');
    if (!icon) {
      return;
    }
    icon.classList.remove('fa-play');
    icon.classList.add('fa-stop');
    this.gameBtn.style.visibility = 'visible';
    this.gameLevel.style.visibility = 'visible';
  }

  hideGameLevelScoreTimer() {
    this.gameBtn.style.visibility = 'hidden';
    this.gameLevel.style.visibility = 'hidden';
    this.gameTimer.style.visibility = 'hidden';
    this.gameScore.style.visibility = 'hidden';
  }

  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }

  startGameTimer() {
    this.updateTimerText(this.remainingTimeSec);
    this.timer = setInterval(() => {
      // this.updateTimerText(this.remainingTimeSec);
      if (this.remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.score === this.puppyCount ? Reason.win : Reason.lose);
        return;
      }
      this.updateTimerText(--this.remainingTimeSec);
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }

  initGame() {
    this.score = 0;
    this.gameScore.innerHTML = this.puppyCount;
    this.gameField.init();
  }

  initGameField() {
    this.gameField.setClickListener(null);
    this.gameField = new Field(this.puppyCount, this.hotdogCount);
    this.gameField.setClickListener(this.onItemClick);
    this.remainingTimeSec = this.gameDuration;
  }

  updateScoreBoard() {
    this.gameScore.innerText = this.puppyCount - this.score;
  }
}
