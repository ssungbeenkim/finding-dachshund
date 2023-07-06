'use strict';
import PopUp from './popup.js';
import { GameBuilder, Reason } from './game.js';
import * as sound from './sound.js';
const initPuppy = 2;
const initHotdog = 4;
const duration = 10;
const gameFinishBanner = new PopUp();
const game = new GameBuilder()
    .withGameDuration(duration)
    .withPuppyCount(initPuppy)
    .withHotdogCount(initHotdog)
    .build();
game.setGameStopListener((reason, level, score, time) => {
    switch (reason) {
        case Reason.cancel:
            sound.playAlert();
            gameFinishBanner.showWithText(level, score, time);
            break;
        case Reason.win:
            sound.playWin();
            break;
        case Reason.lose:
            sound.playHotdog();
            gameFinishBanner.showWithText(level, score, time);
            break;
    }
});
gameFinishBanner.setClickListener(() => {
    game.restart(initPuppy, initHotdog);
});
//# sourceMappingURL=main.js.map