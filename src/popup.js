'use strict';

const BASE_URL = 'http://localhost:8080/scores';

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
    this.positionElement;
  }

  hide() {
    this.popUp.classList.add('pop-up--hide');
    const rankingItems = document.querySelectorAll('.ranking__item');
    rankingItems.forEach((item) => {
      item.remove();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  async showWithText(level, score, time) {
    // TODO :로딩스피너
    const data = await this.loadItems(); // await ?
    this.rank = this.findRank(data, { level, score, time });
    this.displayItems(data, level, score, time);
    this.popUp.classList.remove('pop-up--hide');
  }

  displayItems(data, level, score, time) {
    this.positionElement = document.querySelector('.ranking-list__description');
    if (this.rank <= 5) {
      const rankerHtmlArr = this.createRankerHtmlArr(data, 4);
      const playerHtml = this.createPlayerHtml({ level, score, time });
      rankerHtmlArr.splice(this.rank - 1, 0, playerHtml).pop();
      const rankerHtml = rankerHtmlArr.join('');
      this.positionElement.insertAdjacentHTML('afterend', rankerHtml);
      setTimeout(function () {
        document.querySelector('.form__text').focus();
      }, 100);
      this.handleSubmit(level, score, time);
    } else {
      // 랭커가 아닌 경우
      const rankerHtml = this.createRankerHtmlArr(data, 5).join('');
      this.positionElement.insertAdjacentHTML('afterend', rankerHtml);
    }
  }

  // 랭커가 입력을 submit하면 랭킹이 저장되고, 랭킹이 저장되면 랭킹이 다시 로드된다.
  // Todo : 일단 다시 fetch해서 보여주는 부분으로 만들고 나중에 리팩토링
  handleSubmit(level, score, time) {
    const form = document.querySelector('.input__form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.querySelector('.form__text').value.trim();
      if (name === '') {
        alert('Please enter your name.');
        return;
      }
      if (name.length > 10) {
        alert('Please enter within 10 characters.');
        return;
      }
      const ranker = { name, level, score, time }; // 현재 랭커의 데이터 생성.
      const newData = await this.postItem(ranker);
      const newRankerHtml = this.createRankerHtmlArr(newData, 5).join('');
      const rankingItems = document.querySelectorAll('.ranking__item');
      rankingItems.forEach((item) => {
        item.remove(); // 기존의 리스트 삭제
      });
      this.positionElement.insertAdjacentHTML('afterend', newRankerHtml);
      // 새로 만든 리스트 추가
    });
  }

  createRankerHtmlArr(data, listLength) {
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

  createPlayerHtml(item) {
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
        <li class="stage">${item.level}</li>
        <li class="score">${item.score}</li>
        <li class="time">${item.time}</li>
      </ul>
    </li>
    `;
  }

  findRank(data, newData) {
    // 정렬된 리스트를 불러와서 랭크를 찾는다.
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

  async loadItems() {
    return await fetch(BASE_URL, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .catch((err) => console.log('error', err));
  }

  async postItem(item) {
    return await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .catch((err) => console.log('error', err));
  }
}
