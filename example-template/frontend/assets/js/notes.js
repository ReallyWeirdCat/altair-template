// notes.js
// Логика страницы «Заметки»: полный CRUD через те же приёмы, что и на странице задач.

const noteForm = document.getElementById('note-form');
const noteTitle = document.getElementById('note-title');
const noteText = document.getElementById('note-text');
const noteTime = document.getElementById('note-time');
const noteSubmit = document.getElementById('note-submit');
const noteCancel = document.getElementById('note-cancel');
const noteList = document.getElementById('note-list');
const noteEmpty = document.getElementById('note-empty');

let notes = [];

// null — добавляем новую заметку, число — редактируем заметку с этим id.
let editingNoteId = null;

// Переводим ISO-время в значение для input[type="datetime-local"].
function toDateTimeLocal(value) {
  const date = value instanceof Date ? value : new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

// Переводим локальное время из формы в ISO-строку для сервера.
function fromDateTimeLocal(value) {
  return new Date(value).toISOString();
}

// Форматируем время для показа пользователю.
function formatTime(isoString) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(isoString));
}

function setDefaultTime() {
  noteTime.value = toDateTimeLocal(new Date());
}

function resetNoteForm() {
  noteForm.reset();
  editingNoteId = null;
  noteSubmit.textContent = 'Добавить';
  noteCancel.hidden = true;
  setDefaultTime();
}

async function loadNotes() {
  try {
    notes = await getNotes();
    renderNotes();
  } catch (error) {
    alert(error.message);
  }
}

function renderNotes() {
  noteList.innerHTML = '';
  noteEmpty.hidden = notes.length > 0;

  notes.forEach(function (note) {
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

    const actions = document.createElement('div');
    actions.className = 'item__actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'button button--secondary';
    editButton.textContent = 'Изменить';
    editButton.addEventListener('click', function () {
      startEdit(note);
    });

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
      removeNote(note.id);
    });

    actions.append(editButton, deleteButton);
    item.append(body, actions);
    noteList.appendChild(item);
  });
}

function startEdit(note) {
  editingNoteId = note.id;
  noteTitle.value = note.title;
  noteText.value = note.text;
  noteTime.value = toDateTimeLocal(note.time);
  noteSubmit.textContent = 'Сохранить';
  noteCancel.hidden = false;
  noteTitle.focus();
}

async function removeNote(id) {
  if (!confirm('Удалить заметку?')) {
    return;
  }

  try {
    await deleteNote(id);

    if (editingNoteId === id) {
      resetNoteForm();
    }

    await loadNotes();
  } catch (error) {
    alert(error.message);
  }
}

noteForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const title = noteTitle.value.trim();
  const text = noteText.value.trim();

  if (!title || !text) {
    alert('Заполните название и текст заметки');
    return;
  }

  const selectedDate = new Date(noteTime.value);
  if (Number.isNaN(selectedDate.getTime())) {
    alert('Введите корректное время');
    return;
  }

  const note = {
    title: title,
    text: text,
    time: fromDateTimeLocal(noteTime.value)
  };

  try {
    if (editingNoteId === null) {
      await createNote(note);
    } else {
      await updateNote(editingNoteId, note);
    }

    resetNoteForm();
    await loadNotes();
  } catch (error) {
    alert(error.message);
  }
});

noteCancel.addEventListener('click', function () {
  resetNoteForm();
});

// Начальная загрузка страницы.
setDefaultTime();
loadNotes();

// Пример: чтобы добавить любимый цвет заметки, добавьте колонку color в notes,
// поле color в модель и маршрут, input в HTML и свойство в объект note выше.
