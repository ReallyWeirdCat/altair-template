// tasks.js
// Логика страницы «Задачи»: загрузка списка, добавление, редактирование и удаление.
//
// Скрипт получает элементы страницы через document.getElementById,
// затем подписывается на события формы и кнопок.

const taskForm = document.getElementById('task-form');
const taskText = document.getElementById('task-text');
const taskTime = document.getElementById('task-time');
const taskDone = document.getElementById('task-done');
const taskSubmit = document.getElementById('task-submit');
const taskCancel = document.getElementById('task-cancel');
const taskList = document.getElementById('task-list');
const taskEmpty = document.getElementById('task-empty');

// Данные, загруженные с сервера. Они нужны, чтобы при нажатии «Изменить»
// заполнить форму значениями выбранной задачи.
let tasks = [];

// null означает «форма в режиме добавления».
// Если здесь лежит id, форма редактирует задачу с этим id.
let editingTaskId = null;

// Браузер хранит время в UTC, а input[type="datetime-local"] показывает
// локальное время без часового пояса. Эта функция переводит одно в другое.
function toDateTimeLocal(value) {
  const date = value instanceof Date ? value : new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

// Обратное преобразование: локальное значение из формы — в ISO-строку для API.
// ISO 8601 выглядит так: 2026-11-06T10:30:00.000Z.
function fromDateTimeLocal(value) {
  return new Date(value).toISOString();
}

// Показываем дату и время в привычном русском формате.
function formatTime(isoString) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(isoString));
}

// По умолчанию в поле времени ставим текущий момент.
function setDefaultTime() {
  taskTime.value = toDateTimeLocal(new Date());
}

// Возвращаем форму в режим добавления.
function resetTaskForm() {
  taskForm.reset();
  editingTaskId = null;
  taskSubmit.textContent = 'Добавить';
  taskCancel.hidden = true;
  setDefaultTime();
}

// Загружаем задачи с сервера. Если сервер вернул ошибку, показываем её в alert.
async function loadTasks() {
  try {
    tasks = await getTasks();
    renderTasks();
  } catch (error) {
    alert(error.message);
  }
}

// Создаём элементы списка средствами DOM.
// textContent используется вместо innerHTML, чтобы текст пользователя
// не мог превратиться в HTML-код (это защита от XSS).
function renderTasks() {
  taskList.innerHTML = '';
  taskEmpty.hidden = tasks.length > 0;

  tasks.forEach(function (task) {
    const item = document.createElement('li');
    item.className = task.done ? 'item item--done' : 'item';

    const body = document.createElement('div');
    body.className = 'item__body';

    const title = document.createElement('p');
    title.className = 'item__title';
    title.textContent = task.text;

    const meta = document.createElement('div');
    meta.className = 'item__meta';

    const time = document.createElement('span');
    time.textContent = formatTime(task.time);

    meta.appendChild(time);
    body.append(title, meta);

    const actions = document.createElement('div');
    actions.className = 'item__actions';

    // Кнопка редактирования заполняет форму значениями задачи.
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'button button--secondary';
    editButton.textContent = 'Изменить';
    editButton.addEventListener('click', function () {
      startEdit(task);
    });

    // Кнопка удаления — только иконка, поэтому подпись нужна для доступности.
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'button button--icon';
    deleteButton.title = 'Удалить';
    deleteButton.setAttribute('aria-label', 'Удалить задачу');

    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'assets/icon/delete.svg';
    deleteIcon.alt = '';

    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener('click', function () {
      removeTask(task.id);
    });

    actions.append(editButton, deleteButton);
    item.append(body, actions);
    taskList.appendChild(item);
  });
}

// Включаем режим редактирования и заполняем форму данными задачи.
function startEdit(task) {
  editingTaskId = task.id;
  taskText.value = task.text;
  taskTime.value = toDateTimeLocal(task.time);
  taskDone.checked = Boolean(task.done);
  taskSubmit.textContent = 'Сохранить';
  taskCancel.hidden = false;
  taskText.focus();
}

// Удаляем задачу после подтверждения пользователя.
async function removeTask(id) {
  if (!confirm('Удалить задачу?')) {
    return;
  }

  try {
    await deleteTask(id);

    // Если удалили задачу, которая сейчас открыта в форме, сбрасываем форму.
    if (editingTaskId === id) {
      resetTaskForm();
    }

    await loadTasks();
  } catch (error) {
    alert(error.message);
  }
}

// Отправка формы: один и тот же обработчик создаёт новую задачу
// или сохраняет изменения существующей.
taskForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const text = taskText.value.trim();

  // Простая проверка на клиенте. Сервер проверит данные повторно.
  if (!text) {
    alert('Введите текст задачи');
    return;
  }

  const selectedDate = new Date(taskTime.value);
  if (Number.isNaN(selectedDate.getTime())) {
    alert('Введите корректное время');
    return;
  }

  const task = {
    text: text,
    time: fromDateTimeLocal(taskTime.value),
    done: taskDone.checked
  };

  try {
    if (editingTaskId === null) {
      await createTask(task);
    } else {
      await updateTask(editingTaskId, task);
    }

    resetTaskForm();
    await loadTasks();
  } catch (error) {
    alert(error.message);
  }
});

// Кнопка «Отмена» просто очищает форму и выходит из режима редактирования.
taskCancel.addEventListener('click', function () {
  resetTaskForm();
});

// Начальное состояние страницы.
setDefaultTime();
loadTasks();

// Пример, как добавить новое поле задачи:
// 1) добавьте колонку в таблицу tasks в db.js;
// 2) передайте поле в функциях models/task.js;
// 3) проверьте его в readTask() в routes/tasks.js;
// 4) добавьте input в tasks.html и прочитайте его здесь через .value.
