'use strict';

export default class PopUp {
  constructor() {
    this.popUpText = document.querySelector('.pop-up__message');
    this.popUpRefresh = document.querySelector('.pop-up__refresh');
    this.popUp = document.querySelector('.pop-up');
    this.ranker = false;
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
    // 아이템 로드
    const data = await this.loadItems();
    // 랭커인지 확인
    if (this.isRanker(data, level, score, time)) {
      //리스트 요소 만들어서 추가, 랭커인 경우 임시 데이터를 입력할 수 있다.
      displayItems(data, level, score, time);
      console.log('랭커입니다.');
    } else {
      //리스트 요소 만들어서 추가
      console.log('랭커가 아닙니다.');
    }

    // 팝업 보여주기
    this.popUp.classList.remove('pop-up--hide');
  }

  displayItems(data, level, score, time) {}

  isRanker(data, level, score, time) {
    const newData = { level, score, time };
    const rank = this.findRank(data, newData);
    if (rank <= 5) {
      this.Ranker = true;
      return true;
    } else {
      this.Ranker = false;
      return false;
    }
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
