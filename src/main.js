'use strict';
import PopUp from './popup.js';
import { GameBuilder, Reason } from './game.js';
import * as sound from './sound.js';

const initCarrot = 2;
const initBug = 4;
const duration = 10;

const gameFinishBanner = new PopUp();

const game = new GameBuilder()
  .withGameDuration(duration)
  .withCarrotCount(initCarrot)
  .withBugCount(initBug)
  .build();

game.setGameStopListener((reason) => {
  // level,score
  let message;
  switch (reason) {
    case Reason.cancel:
      // message = 'REPLAY❓';
      sound.playAlert();
      gameFinishBanner.showWithText(); // level, score
      break;
    case Reason.win:
      sound.playWin();
      break;
    case Reason.lose:
      // message = 'YOU LOST';
      sound.playBug();
      gameFinishBanner.showWithText(); // level,score
      break;
  }
  // gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => {
  game.restart(initCarrot, initBug);
});
