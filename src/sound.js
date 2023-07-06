const alertSound = new Audio('./sound/alert.mp3');
const bgSound = new Audio('./sound/bg.mp3');
const hotdogSound = new Audio('./sound/hotdog_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const puppySound = new Audio('./sound/puppy_pull.mp3');

export function playPuppy() {
  playSound(puppySound);
}

export function playHotdog() {
  playSound(hotdogSound);
}

export function playAlert() {
  playSound(alertSound);
}

export function playWin() {
  playSound(winSound);
}

export function playBackground() {
  playSound(bgSound);
}

export function stopBackground() {
  stopSound(bgSound);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
