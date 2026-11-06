// routes/notes.js
// REST-маршруты заметок. Устроены так же, как маршруты задач:
// GET — чтение, POST — создание, PUT — обновление, DELETE — удаление.

const express = require('express');
const Note = require('../models/note');

const router = express.Router();

// Проверка обязательных полей заметки: title, text, time.
function readNote(body) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const time = typeof body.time === 'string' ? body.time.trim() : '';

  if (!title) {
    return { error: 'Поле "title" не должно быть пустым' };
  }

  if (!text) {
    return { error: 'Поле "text" не должно быть пустым' };
  }

  if (!time) {
    return { error: 'Поле "time" не должно быть пустым' };
  }

  return { title, text, time };
}

function readId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/notes — все заметки.
router.get('/', (req, res) => {
  const notes = Note.getAllNotes();
  res.json(notes);
});

// GET /api/notes/:id — одна заметка.
router.get('/:id', (req, res) => {
  const id = readId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Некорректный id' });
  }

  const note = Note.getNoteById(id);
  if (!note) {
    return res.status(404).json({ error: 'Заметка не найдена' });
  }

  res.json(note);
});

// POST /api/notes — создать заметку.
router.post('/', (req, res) => {
  const data = readNote(req.body || {});

  if (data.error) {
    return res.status(400).json({ error: data.error });
  }

  const note = Note.createNote(data.title, data.text, data.time);
  res.status(201).json(note);
});

// PUT /api/notes/:id — обновить заметку.
router.put('/:id', (req, res) => {
  const id = readId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Некорректный id' });
  }

  const data = readNote(req.body || {});
  if (data.error) {
    return res.status(400).json({ error: data.error });
  }

  const note = Note.updateNote(id, data.title, data.text, data.time);
  if (!note) {
    return res.status(404).json({ error: 'Заметка не найдена' });
  }

  res.json(note);
});

// DELETE /api/notes/:id — удалить заметку.
router.delete('/:id', (req, res) => {
  const id = readId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Некорректный id' });
  }

  const deleted = Note.deleteNote(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Заметка не найдена' });
  }

  res.status(204).end();
});

module.exports = router;
