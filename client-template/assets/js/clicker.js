// clicker.js
// Логика страницы «Счётчик».
//
// Сервера и Node.js нет: страница работает целиком в браузере.
// localStorage — встроенное в браузер хранилище пар «ключ — значение».
// Оно сохраняет данные между перезагрузками страницы и закрытиями браузера.
// Важно: localStorage умеет хранить только строки, поэтому объект состояния
// превращается в строку через JSON.stringify и обратно через JSON.parse.

// Ключ, под которым состояние счётчика лежит в localStorage.
// У задач на странице todo.html есть свой отдельный ключ.
const STORAGE_KEY = 'altair.clicker.v1';

// Начальное состояние. Пока в приложении только счётчик,
// но сюда удобно добавлять новые поля по мере развития проекта.
const DEFAULT_STATE = {
  clicks: 0
};

// Получаем элементы страницы по id.
const heartButton = document.getElementById('heart-button');
const clickCount = document.getElementById('click-count');
const clickLabel = document.getElementById('click-label');
const resetButton = document.getElementById('reset-button');

// Текущее состояние приложения. При запуске пробуем восстановить его из localStorage.
let state = loadState();

// Читаем состояние из localStorage.
// Если данных нет, они повреждены или хранилище недоступно,
// возвращаем безопасное начальное состояние.
function loadState() {
  try {
    const savedText = localStorage.getItem(STORAGE_KEY);

    if (!savedText) {
      return { ...DEFAULT_STATE };
    }

    const saved = JSON.parse(savedText);

    // Проверяем, что число нажатий — целое неотрицательное число.
    // Так испорченные вручную данные не сломают интерфейс.
    if (!saved || !Number.isInteger(saved.clicks) || saved.clicks < 0) {
      return { ...DEFAULT_STATE };
    }

    return { clicks: saved.clicks };
  } catch (error) {
    // Например, браузер может запретить localStorage в приватном режиме.
    console.warn('Не удалось прочитать localStorage:', error);
    return { ...DEFAULT_STATE };
  }
}

// Записываем текущее состояние в localStorage.
// Сохраняем весь объект целиком: когда появятся новые поля,
// их не придётся записывать отдельными командами.
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Не удалось сохранить состояние в localStorage:', error);
  }
}

// Подбираем правильную форму слова «нажатие» для русского языка:
// 1 нажатие, 2 нажатия, 5 нажатий, 11 нажатий, 21 нажатие.
function getClicksWord(count) {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return 'нажатий';
  }

  if (last === 1) {
    return 'нажатие';
  }

  if (last >= 2 && last <= 4) {
    return 'нажатия';
  }

  return 'нажатий';
}

// Показываем текущее состояние в интерфейсе.
// Отдельная функция render() позволяет обновлять страницу
// после каждого изменения данных в одном месте.
function render() {
  clickCount.textContent = state.clicks.toLocaleString('ru-RU');
  clickLabel.textContent = getClicksWord(state.clicks);
  resetButton.hidden = state.clicks === 0;

  // Обновляем подпись кнопки для тех, кто пользуется скринридером.
  heartButton.setAttribute(
    'aria-label',
    `Увеличить счётчик нажатий. Сейчас: ${state.clicks}`
  );
}

// Нажатие на сердечко:
// 1) увеличиваем счётчик на единицу;
// 2) сохраняем новое состояние;
// 3) перерисовываем интерфейс.
heartButton.addEventListener('click', function () {
  state.clicks = state.clicks + 1;
  saveState();
  render();
});

// Сброс счётчика. Спрашиваем подтверждение,
// чтобы случайное нажатие не уничтожило сохранённый результат.
resetButton.addEventListener('click', function () {
  if (!confirm('Сбросить счётчик?')) {
    return;
  }

  state = { ...DEFAULT_STATE };
  saveState();
  render();
});

// Первый показ данных при открытии страницы.
render();

// Как добавить своё состояние:
// 1. Добавьте поле в DEFAULT_STATE, например lastClickTime: null.
// 2. Обновляйте его при действии пользователя.
// 3. Восстанавливайте его в loadState().
// 4. Вызывайте saveState() после каждого изменения.
//
// Пример:
//
// state.lastClickTime = new Date().toISOString();
// saveState();
//
// Ещё один пример — сохранить выбранную тему:
//
// const saved = { clicks: 0, theme: 'light' };
// document.body.dataset.theme = state.theme;
