'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
// * for the server awakening
const BASE_URL = 'https://find-dachshund.herokuapp.com/scores';
awakening();
function awakening() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fetch(BASE_URL, {
            method: 'GET',
        })
            .then()
            .catch((err) => console.log(err));
    });
}
//# sourceMappingURL=main.js.map