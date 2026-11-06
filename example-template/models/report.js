// models/report.js
// Модель отчёта о настроении. mood в базе — целое число от 1 до 5.
// Ограничение CHECK в таблице служит дополнительной защитой данных.

const db = require('../db');

const selectById = db.prepare('SELECT id, time, mood FROM reports WHERE id = ?');
const selectAll = db.prepare('SELECT id, time, mood FROM reports ORDER BY time DESC, id DESC');

// CREATE — добавить отчёт.
function createReport(time, mood) {
  const result = db
    .prepare('INSERT INTO reports (time, mood) VALUES (?, ?)')
    .run(time, mood);

  return getReportById(result.lastInsertRowid);
}

// READ — получить все отчёты.
function getAllReports() {
  return selectAll.all();
}

// READ — получить отчёт по id.
function getReportById(id) {
  return selectById.get(id) || null;
}

// UPDATE — обновить время и настроение отчёта.
function updateReport(id, time, mood) {
  const result = db
    .prepare('UPDATE reports SET time = ?, mood = ? WHERE id = ?')
    .run(time, mood, id);

  if (result.changes === 0) {
    return null;
  }

  return getReportById(id);
}

// DELETE — удалить отчёт.
function deleteReport(id) {
  const result = db.prepare('DELETE FROM reports WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport
};
