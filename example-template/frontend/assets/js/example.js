// example.js
// Учебный скрипт новой страницы. Он показывает минимальный рабочий цикл:
// загрузить данные, показать их, добавить запись и удалить её.
//
// Внимание: для примера используются заметки и готовые функции из api.js.
// Когда вы будете делать свою сущность, замените getNotes/createNote/deleteNote
// на свои функции, созданные по тому же образцу.

const exampleForm = document.getElementById('example-form');
const exampleTitle = document.getElementById('example-title');
const exampleText = document.getElementById('example-text');
const exampleList = document.getElementById('example-list');
const exampleEmpty = document.getElementById('example-empty');

// Здесь храним заметки, полученные с сервера, чтобы отрисовать их.
let exampleNotes = [];

// Formatting-функция превращает ISO-строку в понятную дату.
function formatTime(isoString) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(isoString));
}

// Получаем данные и перерисовываем список.
async function loadExampleNotes() {
  try {
    exampleNotes = await getNotes();
    renderExampleNotes();
  } catch (error) {
    alert(error.message);
  }
}

// Создаём DOM-элементы для каждой записи.
// Никакого innerHTML с данными пользователя: только textContent — это безопасно.
function renderExampleNotes() {
  exampleList.innerHTML = '';
  exampleEmpty.hidden = exampleNotes.length > 0;

  exampleNotes.forEach(function (note) {
    const item = document.createElement('li');
    item.className = 'item';

    const body = document.createElement('div');
    body.className = 'item__body';

    const title = document.createElement('p');
    title.className = 'item__title';
    title.textContent = note.title;

    const text = document.createElement('p');
    text.className = 'item__text';
    text.textContent = note.text;

    const meta = document.createElement('div');
    meta.className = 'item__meta';

    const time = document.createElement('span');
    time.textContent = formatTime(note.time);

    meta.appendChild(time);
    body.append(title, text, meta);

    // Кнопка удаления использует общую иконку корзины.
    const actions = document.createElement('div');
    actions.className = 'item__actions';

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'button button--icon';
    deleteButton.title = 'Удалить';
    deleteButton.setAttribute('aria-label', 'Удалить заметку');

    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'assets/icon/delete.svg';
    deleteIcon.alt = '';

    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener('click', function () {
      removeExampleNote(note.id);
    });

    actions.appendChild(deleteButton);
    item.append(body, actions);
    exampleList.appendChild(item);
  });
}

// Отправка формы: проверяем поля, отправляем JSON на сервер, обновляем список.
exampleForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const title = exampleTitle.value.trim();
  const text = exampleText.value.trim();

  if (!title || !text) {
    alert('Заполните название и текст');
    return;
  }

  const note = {
    title: title,
    text: text,
    // В этом примере время не выбирает пользователь — ставим текущее.
    time: new Date().toISOString()
  };

  try {
    await createNote(note);
    exampleForm.reset();
    await loadExampleNotes();
  } catch (error) {
    alert(error.message);
  }
});

// Удаление записи с подтверждением.
async function removeExampleNote(id) {
  if (!confirm('Удалить заметку?')) {
    return;
  }

  try {
    await deleteNote(id);
    await loadExampleNotes();
  } catch (error) {
    alert(error.message);
  }
}

// Запускаем загрузку при открытии страницы.
loadExampleNotes();

// Пример, как добавить редактирование:
// 1. Завести переменную editingId = null.
// 2. В renderExampleNotes создать кнопку «Изменить», которая заполняет форму.
// 3. В обработчике submit вызывать updateNote(editingId, note), если editingId не null.
// 4. После успешного сохранения сбрасывать форму и снова вызывать loadExampleNotes().
