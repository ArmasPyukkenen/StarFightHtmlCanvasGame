export class Menu {
  constructor() {
    this.menu = document.querySelector('menu');
    this.buttons = this.menu.querySelectorAll('button');
    this.buttonListeners = Array.prototype.map.call(this.buttons, el => null);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
  }

  hide() {
    this.menu.classList.add('hidden');
  }

  show() {
    this.menu.classList.remove('hidden');
  }

  bindAction(index, action, toHide=true) {
    this.buttonListeners[index] = action;
    this.buttons[index].addEventListener('click', action);
    this.buttons[index].classList.remove('menu__button_inactive');
    if( toHide ) {
      this.buttons[index].addEventListener('click', this.hide);
    }
  }

  unbindAction(index) {
    this.buttons[index].removeEventListener('click', this.buttonListeners[index]);
    this.buttons[index].removeEventListener('click', this.hide);
    this.buttons[index].classList.add('menu__button_inactive');
    this.buttonListeners[index] = null;
  }
}