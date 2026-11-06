// routes/tasks.js
// Маршрут (route) — правило вида «метод + адрес + что сделать».
// Этот файл описывает REST API для задач.
//
// REST — стиль построения API, где адрес обозначает сущность (/api/tasks),
// а HTTP-метод — действие: GET прочитать, POST создать, PUT обновить,
// DELETE удалить. Сервер отвечает JSON-объектами.
//
// Вся проверка данных и формирование ответа находятся прямо в маршрутах,
// чтобы ученику было легко проследить путь запроса от начала до конца.

const express = require('express');
const Task = require('../models/task');

const router = express.Router();

// Проверяем поля задачи и возвращаем либо ошибку, либо очищенные данные.
// Обязательные поля: text и time. Пробелы по краям не считаются содержимым.
function readTask(body) {
  const text = typeof body.text === 'string' ? body.text.trim() : '';
  const time = typeof body.time === 'string' ? body.time.trim() : '';

  if (!text) {
    return { error: 'Поле "text" не должно быть пустым' };
  }

  if (!time) {
    return { error: 'Поле "time" не должно быть пустым' };
  }

  // В базе done хранится как 0 или 1. Boolean приводим к числу.
  return {
    text: text,
    time: time,
    done: body.done ? 1 : 0
  };
}

// Превращаем строку из URL в число. Некорректный id — ошибка клиента (400).
function readId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET /api/tasks — получить список всех задач.
router.get('/', (req, res) => {
  const tasks = Task.getAllTasks();
  res.json(tasks);
});

// GET /api/tasks/:id — получить одну задачу.
// :id — параметр маршрута, его значение Express кладёт в req.params.id.
router.get('/:id', (req, res) => {
  const id = readId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Некорректный id' });
  }

  const task = Task.getTaskById(id);
  if (!task) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  res.json(task);
});

// POST /api/tasks — создать задачу.
// req.body — данные, которые клиент отправил в формате JSON.
// Статус 201 означает «создано».
router.post('/', (req, res) => {
  const data = readTask(req.body || {});

  if (data.error) {
    return res.status(400).json({ error: data.error });
  }

  const task = Task.createTask(data.text, data.time, data.done);
  res.status(201).json(task);
});

// PUT /api/tasks/:id — полностью обновить задачу.
router.put('/:id', (req, res) => {
  const id = readId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Некорректный id' });
  }

  const data = readTask(req.body || {});
  if (data.error) {
    return res.status(400).json({ error: data.error });
  }

  const task = Task.updateTask(id, data.text, data.time, data.done);
  if (!task) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  res.json(task);
});

// DELETE /api/tasks/:id — удалить задачу.
// Статус 204 означает «успешно, но тела ответа нет».
router.delete('/:id', (req, res) => {
  const id = readId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Некорректный id' });
  }

  const deleted = Task.deleteTask(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  res.status(204).end();
});

module.exports = router;

// Пример нового маршрута для другой сущности:
//
// router.get('/search', (req, res) => {
//   // Логика поиска при необходимости пишется прямо здесь.
//   res.json({ message: 'Здесь может быть поиск' });
// });
//
// Затем подключите router в index.js через app.use('/api/tasks', ...).
