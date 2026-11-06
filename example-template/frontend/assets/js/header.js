// header.js
// Небольшой общий скрипт для шапки: считает нажатия на кнопку справа.
//
// DOMContentLoaded — событие, которое браузер вызывает после построения HTML-страницы.
// Даже если скрипт подключён в <head> без defer, все элементы уже будут доступны.
document.addEventListener('DOMContentLoaded', function () {
  const counterButton = document.getElementById('click-counter');
  const counterValue = document.getElementById('click-count');

  // Если на странице нет шапки, скрипт просто ничего не делает.
  if (!counterButton || !counterValue) {
    return;
  }

  let clicks = 0;

  // addEventListener подписывает кнопку на событие click.
  counterButton.addEventListener('click', function () {
    clicks = clicks + 1;
    counterValue.textContent = clicks;
  });
});
