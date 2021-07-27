document.addEventListener('DOMContentLoaded', () => {
  const main = new Main();
});

class Main {
  constructor() {
    this.header = document.querySelector('.header');
    // TODO: .(ピリオド)忘れがち
    this.sections = [
      '.hero',
      '.about-me',
      '.services',
      '.portfolio',
      '.testimonials',
      '.blog',
      '.contact',
    ];
    this.navItems = document.querySelectorAll('.header__nav-item');
    // this.itemsLazyloaded = document.querySelectorAll('.lazyload');
    this._observers = [];
    this._init();
  }

  set observers(val) {
    this._observers.push(val);
  }

  get observers() {
    return this._observers;
  }

  // _init() {
  //   Pace.on('done', this._paceDone.bind(this));
  // }
  // _paceDone() {
  //   this._scrollInit();
  // }
  _init() {
    this._scrollInit();
  }

  //   ビュー内のsectionのメニューアイテムをハイライト
  _highlightMenuItem(el, inview) {
    console.log('inviwe');
    //   elはインスタンス化したScrollObserverのsection、inviewはintersectingのboolean
    this.navItems.forEach(item => {
      console.log('aaa');
      const itemHref = item.childNodes[0].getAttribute('href');
      console.log(itemHref);
      const activeSection = el.getAttribute('id');
      if (!inview) return;
      if (inview) {
        if (activeSection === itemHref.slice(1)) {
          item.childNodes[0].classList.add('u-active-item');
          console.log('u-active-item');
        } else {
          item.childNodes[0].classList.remove('u-active-item');
        }
      }
    });
  }
  //   headerのbackgroundを変更
  _navAnimation(el, inview) {
    if (inview) {
      this.header.classList.remove('header-bg');
    } else {
      this.header.classList.add('header-bg');
    }
  }

  _destroyObservers() {
    this.observers.forEach(ob => {
      ob.destroy();
    });
  }

  destroy() {
    this._destroyObservers();
  }

  _scrollInit() {
    // ヘッダー背景の変形
    this.observers = new ScrollObserver(
      '.hero',
      this._navAnimation.bind(this),
      { once: false, rootMargin: '-10%' }
    );
    // メニューの現在のアイテムのハイライト
    this.sections.forEach(section => {
      this.observers = new ScrollObserver(
        section,
        this._highlightMenuItem.bind(this),
        { once: false, rootMargin: '-50% 0px' }
      );
    });
  }
}
