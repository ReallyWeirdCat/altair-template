// routes/reports.js
// REST-маршруты отчётов о настроении.
// mood должен быть именно целым числом от 1 до 5 — строку "3" не принимаем,
// чтобы правило проверки было однозначным и легко читалось.

const express = require('express');
const Report = require('../models/report');

const router = express.Router();

// Проверяем time и mood. Возвращаем либо { error }, либо данные.
function readReport(body) {
  const time = typeof body.time === 'string' ? body.time.trim() : '';
  const mood = body.mood;

  if (!time) {
    return { error: 'Поле "time" не должно быть пустым' };
  }

  // Number.isInteger проверяет, что число не дробное.
  if (!Number.isInteger(mood) || mood < 1 || mood > 5) {
    return { error: 'Поле "mood" должно быть целым числом от 1 до 5' };
  }

  return { time, mood };
}

function readId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/reports — все отчёты.
router.get('/', (req, res) => {
  const reports = Report.getAllReports();
  res.json(reports);
});

// GET /api/reports/:id — один отчёт.
router.get('/:id', (req, res) => {
  const id = readId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Некорректный id' });
  }

  const report = Report.getReportById(id);
  if (!report) {
    return res.status(404).json({ error: 'Отчёт не найден' });
  }

  res.json(report);
});

// POST /api/reports — создать отчёт.
router.post('/', (req, res) => {
  const data = readReport(req.body || {});

  if (data.error) {
    return res.status(400).json({ error: data.error });
  }

  const report = Report.createReport(data.time, data.mood);
  res.status(201).json(report);
});

// PUT /api/reports/:id — обновить отчёт.
router.put('/:id', (req, res) => {
  const id = readId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Некорректный id' });
  }

  const data = readReport(req.body || {});
  if (data.error) {
    return res.status(400).json({ error: data.error });
  }

  const report = Report.updateReport(id, data.time, data.mood);
  if (!report) {
    return res.status(404).json({ error: 'Отчёт не найден' });
  }

  res.json(report);
});

// DELETE /api/reports/:id — удалить отчёт.
router.delete('/:id', (req, res) => {
  const id = readId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Некорректный id' });
  }

  const deleted = Report.deleteReport(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Отчёт не найден' });
  }

  res.status(204).end();
});

module.exports = router;
