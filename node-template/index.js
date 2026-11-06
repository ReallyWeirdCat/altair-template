// index.js
// Главный файл приложения. Он делает четыре вещи:
// 1) запускает веб-сервер Express;
// 2) подключает API-маршруты;
// 3) раздаёт файлы фронтенда из папки frontend/;
// 4) обрабатывает непредвиденные ошибки.

const express = require('express');
const config = require('./config');

// Подключаем базу заранее, чтобы таблицы создались до первого запроса.
// db.js сам создаёт файл базы и нужные таблицы, если их ещё нет.
require('./db');

const tasksRouter = require('./routes/tasks');
const notesRouter = require('./routes/notes');
const reportsRouter = require('./routes/reports');

const app = express();

// Middleware — это функция, которая обрабатывает запрос по пути к маршруту.
// express.json() читает JSON из тела запроса и кладёт готовый объект в req.body.
app.use(express.json());

// Подключаем группы маршрутов.
// Префикс /api/tasks означает, что все маршруты из tasksRouter
// доступны по адресам /api/tasks, /api/tasks/:id и т.д.
app.use('/api/tasks', tasksRouter);
app.use('/api/notes', notesRouter);
app.use('/api/reports', reportsRouter);

// Если клиент обратился к несуществующему API-адресу,
// отвечаем JSON, а не HTML-страницей.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Маршрут API не найден' });
});

// Обратите внимание:
// Приложение подбирает нужные маршруты в том же порядке, в котором они были подключены
// через app.use(). Значит, если бы мы подключили обработчик ошибки 404 самым первым,
// то тогда все запросы к /api/* попадали бы именно в него, не доходя до остальных маршрутов.

// Раздача статики — отдельных готовых файлов (HTML, CSS, JS, картинки).
// express.static ищет запрошенный путь внутри frontend/.
// Например, /tasks.html отдаст frontend/tasks.html.
app.use(express.static(config.frontendPath));

// При открытии главной страницы сразу показываем задачи.
app.get('/', (req, res) => {
  res.redirect('/tasks.html');
});

// Обработчик ошибок Express вызывает последним.
// У него обязательно четыре аргумента, иначе Express не распознает его как error handler.
app.use((error, req, res, next) => {
  // Если клиент прислал сломанный JSON, это ошибка клиента (400), а не сервера.
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

// Пример подключения нового API:
//
// const booksRouter = require('./routes/books');
// app.use('/api/books', booksRouter);
