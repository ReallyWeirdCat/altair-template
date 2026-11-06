// models/task.js
// Модель — это модуль, который знает всё о хранении одной сущности в базе.
// Здесь нет HTTP и проверки полей: только SQL-запросы (CRUD).
//
// CRUD — четыре основные операции с данными:
// Create (создать), Read (прочитать), Update (обновить), Delete (удалить).

const db = require('../db');

// prepare(...) заранее разбирает SQL-запрос и возвращает готовую команду.
// Знак ? — это место для значения. Значения передаются отдельно в run/get/all,
// поэтому SQL-инъекция (подстановка опасного SQL-кода) через данные невозможна.
const selectById = db.prepare('SELECT id, text, time, done FROM tasks WHERE id = ?');
const selectAll = db.prepare('SELECT id, text, time, done FROM tasks ORDER BY time DESC, id DESC');

// CREATE — создать задачу и вернуть её вместе с новым id.
function createTask(text, time, done) {
  const result = db
    .prepare('INSERT INTO tasks (text, time, done) VALUES (?, ?, ?)')
    .run(text, time, done);

  // lastInsertRowid — id, который SQLite только что назначил новой строке.
  return getTaskById(result.lastInsertRowid);
}

// READ — получить все задачи.
// Сначала показываем более позднее время, а при равенстве — более новые записи.
function getAllTasks() {
  return selectAll.all();
}

// READ — получить одну задачу по id.
// Если строки нет, get() вернёт undefined; заменяем это на null.
function getTaskById(id) {
  return selectById.get(id) || null;
}

// UPDATE — заменить все поля существующей задачи.
function updateTask(id, text, time, done) {
  const result = db
    .prepare('UPDATE tasks SET text = ?, time = ?, done = ? WHERE id = ?')
    .run(text, time, done, id);

  // changes — количество изменённых строк. 0 значит, что задачи с таким id нет.
  if (result.changes === 0) {
    return null;
  }

  return getTaskById(id);
}

// DELETE — удалить задачу. Возвращаем true/false: получилось ли удаление.
function deleteTask(id) {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
};

// Пример, как добавить свою модель (например, для книг):
//
// const db = require('../db');
//
// function createBook(title, author, time) {
//   const result = db
//     .prepare('INSERT INTO books (title, author, time) VALUES (?, ?, ?)')
//     .run(title, author, time);
//   return getBookById(result.lastInsertRowid);
// }
//
// function getAllBooks() {
//   return db.prepare('SELECT * FROM books ORDER BY time DESC, id DESC').all();
// }
//
// function getBookById(id) {
//   return db.prepare('SELECT * FROM books WHERE id = ?').get(id) || null;
// }
//
// function updateBook(id, title, author, time) {
//   const result = db
//     .prepare('UPDATE books SET title = ?, author = ?, time = ? WHERE id = ?')
//     .run(title, author, time, id);
//   return result.changes === 0 ? null : getBookById(id);
// }
//
// function deleteBook(id) {
//   return db.prepare('DELETE FROM books WHERE id = ?').run(id).changes > 0;
// }
//
// module.exports = { createBook, getAllBooks, getBookById, updateBook, deleteBook };
