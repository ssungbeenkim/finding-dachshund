import { Field, ItemType } from './field.js';
import * as sound from './sound.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

export class GameBuilder {
  private gameDuration!: number; // TODO: Refectoring
  private puppyCount!: number;
  private hotdogCount!: number;

  withGameDuration(duration: number) {
    this.gameDuration = duration;
    return this;
  }
  withPuppyCount(num: number) {
    this.puppyCount = num;
    return this;
  }
  withHotdogCount(num: number) {
    this.hotdogCount = num;
    return this;
  }

  build() {
    return new Game(this.gameDuration, this.puppyCount, this.hotdogCount);
  }
}
type OnStopListener = (
  reason: string,
  level?: number,
  time?: number,
  score?: number
) => void;
class Game {
  private gameTimer: HTMLElement;
  private gameScore: HTMLElement;
  private gameLevel: HTMLElement;
  private gameBtn: HTMLElement;
  private gameField: Field;
  private started: boolean;
  private score: number;
  private timer: number | undefined; //?
  private remainingTimeSec: number;
  private level: number;
  private onGameStop?: OnStopListener;

  constructor(
    private gameDuration: number,
    private puppyCount: number,
    private hotdogCount: number
  ) {
    this.gameTimer = document.querySelector('.game__timer')! as HTMLElement;
    this.gameScore = document.querySelector('.game__score')! as HTMLElement;
    this.gameLevel = document.querySelector('.game__level')! as HTMLElement;
    this.gameBtn = document.querySelector('.game__button')! as HTMLElement;
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

  setGameStopListener(onGameStop: OnStopListener) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.initGame();
    this.updateLevel();
    this.showStopBtnAndLevel();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBackground();
  }

  restart(initPuppy: number, initHotdog: number) {
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
    this.startGameTimer(/* this.gameDuration */);
  }

  stageUp() {
    this.level++;
    this.puppyCount += 3;
    this.hotdogCount += 3;
  }

  updateLevel() {
    this.gameLevel.innerText = `lv.${this.level}`;
  }

  stop(reason: string) {
    const playTime = this.gameDuration - this.remainingTimeSec;
    this.started = false;
    this.stopGameTimer();
    this.hideGameLevelScoreTimer();
    this.onGameStop &&
      this.onGameStop(reason, this.level, this.score, playTime);
    sound.stopBackground();
  }

  //TODO: Refectoring
  onItemClick = (item: string | null) => {
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

  updateTimerText(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }

  initGame() {
    this.score = 0;
    this.gameScore.innerHTML = `${this.puppyCount}`;
    this.gameField.init();
  }

  initGameField() {
    this.gameField.setClickListener(undefined); // TODO: Refectoring
    this.gameField = new Field(this.puppyCount, this.hotdogCount);
    this.gameField.setClickListener(this.onItemClick);
    this.remainingTimeSec = this.gameDuration;
  }

  updateScoreBoard() {
    this.gameScore.innerText = `${this.puppyCount - this.score}`;
  }
}
