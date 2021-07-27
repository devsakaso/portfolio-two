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
    this.progressBarId = [
      '#progress-bar-1',
      '#progress-bar-2',
      '#progress-bar-3',
      '#progress-bar-4',
    ];
    // this.progressBars = document.querySelectorAll('.progress-bar');
    this._observers = [];
    this._init();
  }

  set observers(val) {
    this._observers.push(val);
  }

  get observers() {
    return this._observers;
  }

  _init() {
    this._scrollInit();
  }

  // appearのアニメーション
  _inviewAnimation(el, inview) {
    if (inview) {
      el.classList.add('inview');
    } else {
      el.classList.remove('inview');
    }
  }

  // progress-barを伸ばす
  _moveProgressBar(el, inview) {
    if (!inview) return;
    if (inview) {
      // activeクラスをつけたらアニメーション発火
      el.classList.add('active');
      if (el.getAttribute('id') === 'progress-bar-2') {
        // スタイルの見た目上barのwidth:80%はleft:70% 90%は80%としている
        el.childNodes[0].style.left = 70 + '%';
      } else {
        el.childNodes[0].style.left = 80 + '%';
      }
    }
  }

  //   ビュー内のsectionのメニューアイテムをハイライト
  _highlightMenuItem(el, inview) {
    //   elはインスタンス化したScrollObserverのsection、inviewはintersectingのboolean
    this.navItems.forEach(item => {
      const itemHref = item.childNodes[0].getAttribute('href');
      const activeSection = el.getAttribute('id');
      if (!inview) return;
      if (inview) {
        if (activeSection === itemHref.slice(1)) {
          item.childNodes[0].classList.add('u-active-item');
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
    // appearのアニメーション
    this.observers = new ScrollObserver('.appear', this._inviewAnimation),
    { rootMargin: '-200px' };
    // progress-barを伸ばす
    this.progressBarId.forEach(bar => {
      this.observers = new ScrollObserver(
        bar,
        this._moveProgressBar.bind(this),
        { once: true, rootMargin: '-20px' }
      );
    });
  }
}
