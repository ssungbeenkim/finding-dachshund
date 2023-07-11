'use strict';

type RankingData = {
  id: number;
  name: string;
  level: number;
  score: number;
  time: number;
};

export default class PopUp {
  private BASE_URL: string = 'https://find-dachshund.herokuapp.com/scores';
  private popUpRefresh: HTMLButtonElement;
  private popUp: HTMLElement;
  private rank: number | null;
  private onClick?: () => void;
  private positionElement: HTMLUListElement | null;

  constructor() {
    this.popUpRefresh = document.querySelector('.pop-up__refresh')!;
    this.popUp = document.querySelector('.pop-up')!;
    this.rank = null;
    this.popUpRefresh.addEventListener('click', () => {
      this.onClick && this.onClick();
      this.hide();
    });
    this.positionElement = null;
  }

  hide() {
    this.popUp.classList.add('pop-up--hide');
    const rankingItems = document.querySelectorAll('.ranking__item');
    rankingItems.forEach((item) => {
      item.remove();
    });
  }

  setClickListener(onClick: () => void) {
    this.onClick = onClick;
  }

  async showWithText(level: number, score: number, time: number) {
    // TODO:로딩스피너
    const data: RankingData[] = await this.loadItems();
    this.rank = this.findRank(data, level, score, time);
    this.displayItems(data, level, score, time);
    this.popUp.classList.remove('pop-up--hide');
  }

  displayItems(
    data: RankingData[],
    level: number,
    score: number,
    time: number
  ) {
    this.positionElement = document.querySelector(
      '.ranking-list__description'
    )!;
    if (this.rank && this.rank <= 5) {
      const rankerHtmlArr = this.createRankerHtmlArr(data, 4);
      const playerHtml = this.createPlayerHtml(level, score, time);
      rankerHtmlArr.splice(this.rank - 1, 0, playerHtml).pop();
      const rankerHtml = rankerHtmlArr.join('');
      this.positionElement.insertAdjacentHTML('afterend', rankerHtml);
      setTimeout(function () {
        const formTextInput = document.querySelector(
          '.form__text'
        ) as HTMLInputElement;
        formTextInput.focus();
      }, 100);
      this.handleSubmit(level, score, time);
    } else {
      // 랭커가 아닌 경우
      const rankerHtml = this.createRankerHtmlArr(data, 5).join('');
      this.positionElement.insertAdjacentHTML('afterend', rankerHtml);
    }
  }

  // 랭커가 입력을 submit하면 랭킹이 저장되고, 랭킹이 저장되면 랭킹이 다시 로드된다.
  // TODO: 일단 다시 fetch해서 보여주는 부분으로 만들고 나중에 리팩토링
  handleSubmit(level: number, score: number, time: number) {
    const form = document.querySelector('.input__form')! as HTMLFormElement;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (
        document.querySelector('.form__text') as HTMLInputElement
      ).value.trim();
      if (name === '') {
        alert('Please enter your name.');
        return;
      }
      if (name.length > 10) {
        alert('Please enter within 10 characters.');
        return;
      }
      const newData = await this.postItem(name, level, score, time);
      const newRankerHtml = this.createRankerHtmlArr(newData, 5).join('');
      const rankingItems = document.querySelectorAll('.ranking__item');
      rankingItems.forEach((item) => {
        item.remove(); // 기존의 리스트 삭제
      });
      (this.positionElement as HTMLUListElement).insertAdjacentHTML(
        'afterend',
        newRankerHtml
      );
      // 새로 만든 리스트 추가
    });
  }

  createRankerHtmlArr(data: RankingData[], listLength: number) {
    const htmlArr = data.slice(0, listLength).map((item) => {
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
    });
    return htmlArr;
  }

  createPlayerHtml(level: number, score: number, time: number) {
    return `
    <li class="ranking__item player">
      <ul class="rank__list">
        <span class="space"></span>
        <li class="name">
          <form class="input__form">
            <input type="text" class="form__text" pattern="[A-Za-z]*" title="English support only. ex) newjeans" placeholder="Enter name" required/>
            <button class="form__submit">
              <i class="fa-solid fa-check"></i>
            </button>
          </form>
        </li>
        <li class="stage">${level}</li>
        <li class="score">${score}</li>
        <li class="time">${time}</li>
      </ul>
    </li>
    `;
  }

  findRank(data: RankingData[], level: number, score: number, time: number) {
    let rank = 1;
    data.forEach((d) => {
      if (d.level > level) {
        rank++;
        return;
      } else if (d.level < level) {
        return;
      } else {
        if (d.score > score) {
          rank++;
          return;
        } else if (d.score < score) {
          return;
        } else {
          if (d.time < time) {
            rank++;
            return;
          } else if (d.time > time) {
            return;
          } else {
            return;
          }
        }
      }
    });
    return rank;
  }

  async loadItems(): Promise<RankingData[]> {
    return await fetch(this.BASE_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .catch((err) => console.log('error', err));
  }

  async postItem(name: string, level: number, score: number, time: number) {
    return await fetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, level, score, time }),
    })
      .then((response) => response.json())
      .catch((err) => console.log('error', err));
  }
}
