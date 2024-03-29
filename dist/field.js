import * as sound from './sound.js';
export const ItemType = Object.freeze({
    puppy: 'puppy',
    hotdog: 'hotdog',
});
export class Field {
    constructor(puppyCount, hotdogCount) {
        this.puppyCount = puppyCount;
        this.hotdogCount = hotdogCount;
        this.itemSize = 100;
        this.onClick = (event) => {
            const target = event.target;
            if (target.matches('.puppy')) {
                target.remove();
                sound.playPuppy();
                this.onItemClick && this.onItemClick(ItemType.puppy);
            }
            else if (target.matches('.hotdog')) {
                this.onItemClick && this.onItemClick(ItemType.hotdog);
            }
        };
        this.puppyCount = puppyCount;
        this.hotdogCount = hotdogCount;
        this.field = document.querySelector('.game__field');
        this.fieldRect = this.field.getBoundingClientRect();
        this.field.addEventListener('click', this.onClick);
    }
    init() {
        this.field.innerHTML = '';
        this._addItem('puppy', this.puppyCount, 'img/puppy.png');
        this._addItem('hotdog', this.hotdogCount, 'img/hotdog.png');
    }
    setClickListener(onItemClick) {
        this.onItemClick = onItemClick;
    }
    _addItem(className, count, imgPath) {
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
}
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//# sourceMappingURL=field.js.map