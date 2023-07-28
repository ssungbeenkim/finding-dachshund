const alertSound = new Audio('./sound/alert.mp3')! as HTMLAudioElement;
const bgSound = new Audio('./sound/bg.mp3')! as HTMLAudioElement;
const hotdogSound = new Audio('./sound/hotdog_pull.mp3')! as HTMLAudioElement;
const winSound = new Audio('./sound/game_win.mp3')! as HTMLAudioElement;
const puppySound = new Audio('./sound/puppy_pull.mp3')! as HTMLAudioElement;

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

function playSound(sound: HTMLAudioElement) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound: HTMLAudioElement) {
  sound.pause();
}
