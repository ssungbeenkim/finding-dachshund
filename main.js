'use strict';
const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const itemSize = 80;

const startBtn = document.querySelector('.game__button');
startBtn.addEventListener('click', initGame);

function initGame() {
  addItem('carrot', 5, 'img/carrot.png');
  addItem('bug', 5, 'img/bug.png');
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - itemSize;
  const y2 = fieldRect.height - itemSize;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
