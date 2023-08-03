'use strict';
import PopUp from './popup.js';
import { GameBuilder, Reason } from './game.js';
import * as sound from './sound.js';

const initPuppy: number = 2;
const initHotdog: number = 4;
const duration: number = 10;

const gameFinishBanner = new PopUp();

const game = new GameBuilder()
  .withGameDuration(duration)
  .withPuppyCount(initPuppy)
  .withHotdogCount(initHotdog)
  .build();

game.setGameStopListener((reason, level, score, time) => {
  switch (reason) {
    case Reason.cancel:
      sound.playAlert(); // TODO: Type Guard refactoring
      if (level !== undefined && score !== undefined && time !== undefined) {
        gameFinishBanner.showWithText(level, score, time);
      }
      break;
    case Reason.win:
      sound.playWin();
      break;
    case Reason.lose:
      sound.playHotdog();
      if (level !== undefined && score !== undefined && time !== undefined) {
        gameFinishBanner.showWithText(level, score, time);
      }
      break;
  }
});

gameFinishBanner.setClickListener(() => {
  game.restart(initPuppy, initHotdog);
});

// * for heroku sleep..
const BASE_URL = 'https://find-dachshund.herokuapp.com';
awakening();
async function awakening() {
  return await fetch(BASE_URL, {
    method: 'GET',
  })
    .then()
    .catch((err) => console.log(err));
}
