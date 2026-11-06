// todo-storage.js
// Общая работа с задачами в localStorage.
// Файл подключается и на странице задач, и на главной странице,
// чтобы обе страницы читали одни и те же данные по одному ключу.
//
// localStorage — встроенное хранилище браузера. Оно сохраняет данные
// между перезагрузками страниц и умеет хранить только строки.
// Поэтому состояние превращается в JSON-строку через JSON.stringify
// и восстанавливается через JSON.parse.

// Ключ, под которым массив задач лежит в localStorage.
const TODO_STORAGE_KEY = 'altair.todo.v1';

// Создаём пустое состояние. Новый массив нужен каждый раз,
// чтобы разные страницы не изменяли один и тот же объект.
function createEmptyTodoState() {
  return { tasks: [] };
}

// Читаем состояние из localStorage и проверяем его структуру.
// Если данных нет или они повреждены, возвращаем пустой список.
function loadTodoState() {
  try {
    const savedText = localStorage.getItem(TODO_STORAGE_KEY);

    if (!savedText) {
      return createEmptyTodoState();
    }

    const saved = JSON.parse(savedText);

    if (!saved || !Array.isArray(saved.tasks)) {
      return createEmptyTodoState();
    }

    // Оставляем только корректные задачи. Это защищает интерфейс
    // от случайно испорченных данных в localStorage.
    const tasks = saved.tasks
      .filter(function (task) {
        return task
          && (typeof task.id === 'string' || typeof task.id === 'number')
          && typeof task.text === 'string'
          && task.text.trim() !== '';
      })
      .map(function (task) {
        return {
          id: String(task.id),
          text: task.text.trim(),
          done: Boolean(task.done)
        };
      });

    return { tasks: tasks };
  } catch (error) {
    console.warn('Не удалось прочитать задачи из localStorage:', error);
    return createEmptyTodoState();
  }
}

// Сохраняем состояние целиком одним объектом.
// Если позже появятся новые поля, их не нужно записывать отдельно.
function saveTodoState(state) {
  try {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Не удалось сохранить задачи в localStorage:', error);
  }
}
