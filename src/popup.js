'use strict';

export default class PopUp {
  constructor() {
    this.popUpText = document.querySelector('.pop-up__message');
    this.popUpRefresh = document.querySelector('.pop-up__refresh');
    this.popUp = document.querySelector('.pop-up');
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

  showWithText(text) {
    this.popUpText.innerText = text;
    this.popUp.classList.remove('pop-up--hide');
  }
}
