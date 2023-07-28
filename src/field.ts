import * as sound from './sound.js';

export const ItemType = Object.freeze({
  puppy: 'puppy',
  hotdog: 'hotdog',
});

export class Field {
  private itemSize: number = 100;
  private field: HTMLElement;
  private fieldRect: DOMRect;
  private onItemClick?: (type: string) => void;

  constructor(private puppyCount: number, private hotdogCount: number) {
    this.puppyCount = puppyCount;
    this.hotdogCount = hotdogCount;
    this.field = document.querySelector('.game__field')! as HTMLElement;
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener('click', this.onClick);
  }

  init() {
    this.field.innerHTML = '';
    this._addItem('puppy', this.puppyCount, 'img/puppy.png');
    this._addItem('hotdog', this.hotdogCount, 'img/hotdog.png');
  }

  setClickListener(onItemClick?: (ItemType: string | null) => void) {
    this.onItemClick = onItemClick;
  }

  _addItem(className: string, count: number, imgPath: string) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - this.itemSize;
    const y2 = this.fieldRect.height - this.itemSize;
    // TODO: 아이템이 겹치지 않게 생성하는 로직 추가
    for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);
      item.style.position = 'absolute';
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.field.appendChild(item);
    }
  }

  onClick = (event: MouseEvent) => {
    const target = event.target! as HTMLElement;
    if (target.matches('.puppy')) {
      target.remove();
      sound.playPuppy();
      this.onItemClick && this.onItemClick(ItemType.puppy);
    } else if (target.matches('.hotdog')) {
      this.onItemClick && this.onItemClick(ItemType.hotdog);
    }
  };
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
