export class Menu {
  constructor() {
    this.menu = document.querySelector('menu');
    this.buttons = this.menu.querySelectorAll('button');
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
    this.buttons[index].addEventListener('click', action);
    if( toHide ) {
      this.buttons[index].addEventListener('click', this.hide);
    }
  }
}