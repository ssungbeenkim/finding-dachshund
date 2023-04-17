'use strict';

export default class PopUp {
  constructor() {
    this.popUpText = document.querySelector('.pop-up__message');
    this.popUpRefresh = document.querySelector('.pop-up__refresh');
    this.popUp = document.querySelector('.pop-up');
    this.rank = null;
    this.popUpRefresh.addEventListener('click', () => {
      this.onClick && this.onClick();
      this.hide();
    });
  }

  hide() {
    this.popUp.classList.add('pop-up--hide');
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  async showWithText(level, score, time) {
    // 아이템 로드, 로딩스피너 보여주기 *
    const data = await this.loadItems();
    this.rank = this.findRank(data, { level, score, time });
    this.displayItems(data, level, score, time);
    this.popUp.classList.remove('pop-up--hide');
  }

  displayItems(data, level, score, time) {
    const positionElement = document.querySelector(
      '.ranking-list__description'
    );
    if (this.rank <= 5) {
      console.log('랭커입니다.');
    } else {
      console.log('랭커가 아닙니다.');
      // data의 1~5인덱스를 가져와 저장한다.
      const rankerData = data.slice(0, 5);
      console.log(rankerData);
      const rankerHtml = rankerData
        .map((item) => this.createRankerHtml(item))
        .join('');
      console.log(rankerHtml);
      positionElement.insertAdjacentHTML('afterend', rankerHtml);
    }
  }

  createRankerHtml(item) {
    return `
    <li class="ranking__item">
      <ul class="rank__list">
        <span class="space"></span>
        <li class="name">${item.name}</li>
        <li class="stage">${item.level}</li>
        <li class="score">${item.score}</li>
        <li class="time">${item.time}</li>
      </ul>
    </li>
    `;
  }

  createrPlayerHtml(item) {
    return `
    <li class="ranking__item player">
      <ul class="rank__list">
        <span class="space"></span>
        <li class="name">
          <form class="input__form">
            <input type="text" class="form__text" />
            <button class="form__submit">
              <i class="fa-solid fa-check"></i>
            </button>
          </form>
        </li>
        <li class="stage">2</li>
        <li class="score">20</li>
        <li class="time">30:00</li>
      </ul>
    </li>
    `;
  }

  findRank(data, newData) {
    let rank = 1;
    data.forEach((d) => {
      if (d.level > newData.level) {
        rank++;
        return;
      } else if (d.level < newData.level) {
        return;
      } else {
        // level이 같으면 스코어를 검사한다. 작으면 rank를 증가시키고 크면 그대로 리턴한다. 같으면 시간을 검사한다.
        if (d.score > newData.score) {
          rank++;
          return;
        } else if (d.score < newData.score) {
          return;
        } else {
          // level, score가 같으면 시간을 검사한다.
          if (d.time < newData.time) {
            rank++;
            return;
          } else if (d.time > newData.time) {
            return;
          } else {
            return;
          }
        }
      }
    });
    return rank;
  }

  loadItems() {
    // 로딩스피너 보여주기 ?
    return fetch('../data/data.json')
      .then((response) => response.json())
      .catch((err) => console.log('error', err));
  }
}
