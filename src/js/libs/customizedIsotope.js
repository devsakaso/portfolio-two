var $grid = $('.portfolio__images').isotope({
  // options
  itemSelector: '.portfolio__item',
  // layoutMode: 'fitRows'
});

// filter items on button click
$('.isotope-filter button').on('click', function () {
  var filterValue = $(this).attr('data-filter');
  $grid.isotope({ filter: filterValue });
});

// クリックを強制実行してabsoluteで消えた高さを確保
$(function () {
  $('.all').click();
});
