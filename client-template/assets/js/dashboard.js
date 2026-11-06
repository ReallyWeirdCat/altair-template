// dashboard.js
// Логика главной страницы: показываем количество невыполненных задач
// и количество нажатий на сердечко.
//
// Данные читаются из тех же ключей localStorage, что и на страницах
// todo.html и clicker.html.

const unfinishedCount = document.getElementById('unfinished-count');
const clicksCount = document.getElementById('clicks-count');

// Ключ счётчика. Он должен совпадать с ключом в assets/js/clicker.js.
const CLICKER_STORAGE_KEY = 'altair.clicker.v1';

// Загружаем общее состояние задач.
const dashboardState = loadTodoState();

// Невыполненная задача — это задача, у которой done равно false.
const unfinishedTasks = dashboardState.tasks.filter(function (task) {
  return !task.done;
});

// toLocaleString добавляет разделитель тысяч в больших числах.
unfinishedCount.textContent = unfinishedTasks.length.toLocaleString('ru-RU');

// Читаем количество нажатий из localStorage.
// Если данных нет или они повреждены, показываем 0.
function loadClicks() {
  try {
    const savedText = localStorage.getItem(CLICKER_STORAGE_KEY);

    if (!savedText) {
      return 0;
    }

    const saved = JSON.parse(savedText);

    if (!saved || !Number.isInteger(saved.clicks) || saved.clicks < 0) {
      return 0;
    }

    return saved.clicks;
  } catch (error) {
    console.warn('Не удалось прочитать счётчик из localStorage:', error);
    return 0;
  }
}

clicksCount.textContent = loadClicks().toLocaleString('ru-RU');
