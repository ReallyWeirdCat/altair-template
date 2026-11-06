const db = require('../db');

// const selectById = db.prepare('SELECT id, title, text, time FROM notes WHERE id = ?');
// const selectAll = db.prepare('SELECT id, title, text, time FROM notes ORDER BY time DESC, id DESC');

// // CREATE — добавить заметку.
// function createNote(title, text, time) {
//   const result = db
//     .prepare('INSERT INTO notes (title, text, time) VALUES (?, ?, ?)')
//     .run(title, text, time);

//   return getNoteById(result.lastInsertRowid);
// }

// // READ — получить все заметки.
// function getAllNotes() {
//   return selectAll.all();
// }

// // READ — получить заметку по id.
// function getNoteById(id) {
//   return selectById.get(id) || null;
// }

// // UPDATE — полностью обновить заметку.
// function updateNote(id, title, text, time) {
//   const result = db
//     .prepare('UPDATE notes SET title = ?, text = ?, time = ? WHERE id = ?')
//     .run(title, text, time, id);

//   if (result.changes === 0) {
//     return null;
//   }

//   return getNoteById(id);
// }

// // DELETE — удалить заметку.
// function deleteNote(id) {
//   const result = db.prepare('DELETE FROM notes WHERE id = ?').run(id);
//   return result.changes > 0;
// }

// module.exports = {
//   createNote,
//   getAllNotes,
//   getNoteById,
//   updateNote,
//   deleteNote
// };
