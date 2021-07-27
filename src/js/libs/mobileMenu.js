const menu = document.querySelector('.mobile-menu');
const nav = document.querySelector('.header__nav');
const navItem = document.querySelectorAll('.header__nav-link');

// mobile-menuのトグル
menu.addEventListener('click', () => {
  menu.classList.toggle('open');
  nav.classList.toggle('show');
  nav.classList.toggle('hide');

});
// ナブアイテムをクリックしたとき
navItem.forEach(item => {
  item.addEventListener('click', () => {
    if (!nav.classList.contains('show')) return;
    if (nav.classList.contains('show')) {
      nav.classList.remove('show');
      nav.classList.add('hide');

      menu.classList.remove('open');
    }
  });
});

// 背景をクリックしたとき
nav.addEventListener('click', () => {
  if (!nav.classList.contains('show')) return;
  if (nav.classList.contains('show')) {
    nav.classList.remove('show');
    nav.classList.add('hide');

    menu.classList.remove('open');
  }
});
