// index.js
// Главный файл приложения. В пустом шаблоне он:
// 1) запускает веб-сервер Express;
// 2) готовит обработку JSON;
// 3) отдаёт страницу frontend/index.html и остальную статику;
// 4) обрабатывает ошибки.
//
// TODO: API-маршрутов пока нет: их нужно добавить, когда появятся свои сущности.

const express = require('express');
const config = require('./config');

// Подключаем базу при старте. Сейчас она создаёт только пустой файл SQLite.
// Когда в db.js появятся таблицы, они тоже создадутся здесь.
require('./db');

const app = express();

// Middleware — функция, которая обрабатывает запрос по пути к маршруту.
// express.json() читает JSON из тела запроса и кладёт готовый объект в req.body.
app.use(express.json());

// TODO: Здесь будут подключаться маршруты. Пример:
const exampleRouter = require('./routes/example');
app.use('/api/example', exampleRouter);

// Пока API пустой: любой запрос к /api/... получает понятный JSON-ответ.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Маршрут API не найден' });
});

// Раздача статики — готовых файлов из frontend/.
// Например, запрос / отдаст frontend/index.html,
// а /assets/css/colors.css — соответствующий файл стилей.
app.use(express.static(config.frontendPath));

// Обработчик ошибок Express всегда подключается последним.
// Четыре аргумента обязательны, иначе Express не распознает его как error handler.
app.use((error, req, res, next) => {
  // Сломанный JSON в теле запроса — ошибка клиента, а не сервера.
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
  }

  console.error('Ошибка сервера:', error);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запускаем сервер. После этого приложение ждёт запросы по указанному порту.
app.listen(config.port, () => {
  console.log(`Сервер запущен: http://localhost:${config.port}`);
});
