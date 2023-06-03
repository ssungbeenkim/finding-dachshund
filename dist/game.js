import { Field, ItemType } from './field.js';
import * as sound from './sound.js';
export const Reason = Object.freeze({
    win: 'win',
    lose: 'lose',
    cancel: 'cancel',
});
//Builder Pattern
export class GameBuilder {
    withGameDuration(duration) {
        this.gameDuration = duration;
        return this;
    }
    withCarrotCount(num) {
        this.carrotCount = num;
        return this;
    }
    withBugCount(num) {
        this.bugCount = num;
        return this;
    }
    build() {
        return new Game(this.gameDuration, this.carrotCount, this.bugCount);
    }
}
class Game {
    constructor(gameDuration, carrotCount, bugCount) {
        this.onItemClick = (item) => {
            if (!this.started) {
                return;
            }
            if (item === ItemType.carrot) {
                this.score++;
                this.updateScoreBoard();
                if (this.score === this.carrotCount) {
                    this.startNext(Reason.win);
                }
            }
            else if (item === ItemType.bug) {
                this.stop(Reason.lose);
            }
        };
        this.gameDuration = gameDuration;
        this.carrotCount = carrotCount;
        this.bugCount = bugCount;
        this.gameTimer = document.querySelector('.game__timer');
        this.gameScore = document.querySelector('.game__score');
        this.gameLevel = document.querySelector('.game__level');
        this.gameBtn = document.querySelector('.game__button');
        this.gameBtn.addEventListener('click', () => {
            if (this.started) {
                this.stop(Reason.cancel);
            }
            else {
                this.start();
            }
        });
        this.gameField = new Field(this.carrotCount, this.bugCount);
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
    restart(initCarrot, initBug) {
        this.carrotCount = initCarrot;
        this.bugCount = initBug;
        this.level = 1;
        this.initGameField();
        this.start();
    }
    startNext(reason) {
        this.stopGameTimer();
        this.onGameStop && this.onGameStop(reason);
        this.stageUp();
        this.updateLevel();
        this.initGame();
        this.startGameTimer(this.gameDuration);
    }
    stop(reason) {
        const playTime = this.gameDuration - this.remainingTimeSec;
        this.started = false;
        this.stopGameTimer();
        this.hideTimerAndScore;
        this.hideGameLevelScoreTimer();
        this.onGameStop &&
            this.onGameStop(reason, this.level, this.score, playTime);
        sound.stopBackground();
    }
    stageUp() {
        this.level++;
        this.carrotCount += 3;
        this.bugCount += 3;
        this.initGameField();
    }
    showStopBtnAndLevel() {
        const icon = this.gameBtn.querySelector('.fa-solid');
        if (!icon) {
            return;
        }
        icon.classList.add('fa-stop');
        icon.classList.remove('fa-play');
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
            this.updateTimerText(this.remainingTimeSec);
            if (this.remainingTimeSec <= 0) {
                clearInterval(this.timer);
                this.stop(this.score === this.carrotCount ? Reason.win : Reason.lose);
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
    updateLevel() {
        this.gameLevel.innerText = `lv.${this.level}`;
    }
    initGame() {
        this.score = 0;
        this.gameScore.innerHTML = this.carrotCount;
        this.gameField.init();
    }
    initGameField() {
        this.gameField.setClickListener(null);
        this.gameField = new Field(this.carrotCount, this.bugCount);
        this.gameField.setClickListener(this.onItemClick);
        this.remainingTimeSec = this.gameDuration;
    }
    updateScoreBoard() {
        this.gameScore.innerText = this.carrotCount - this.score;
    }
}
