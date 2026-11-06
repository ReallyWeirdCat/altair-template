// db.js
// Этот файл отвечает только за базу данных:
// 1) создаёт папку для файла БД, если её нет;
// 2) подключается к SQLite через better-sqlite3;
// 3) создаёт таблицы при первом запуске.
//
// SQLite — это база данных, которая целиком хранится в одном файле (app.db).
// better-sqlite3 — синхронная библиотека: результат запроса возвращается сразу,
// без промисов и async/await. Для учебного проекта это делает код понятнее.
// Минус в том, что можно обрабатывать только по одному запросу.

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('./config');

// Перед открытием файла убеждаемся, что папка data/ существует.
// recursive: true означает «создать все недостающие папки по пути».
fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });

// new Database(...) открывает файл базы. Если файла ещё нет, SQLite создаст его.
const db = new Database(config.dbPath);

// CREATE TABLE IF NOT EXISTS создаёт таблицу только тогда, когда её ещё нет.
// Поэтому этот код можно безопасно выполнять при каждом запуске сервера.
//
// Таблицы намеренно независимы: в них нет foreign key (внешних ключей)
// и связей через JOIN. Так проще понять каждую сущность по отдельности.
// В реальности foreign key и JOIN используются повсеместно.
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    time TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1))
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    time TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time TEXT NOT NULL,
    mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 5)
  );
`);

// Пример, как добавить свою таблицу:
//
// db.exec(`
//   CREATE TABLE IF NOT EXISTS books (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     title TEXT NOT NULL,
//     author TEXT NOT NULL,
//     time TEXT NOT NULL
//   );
// `);
//
// После этого создайте models/book.js и routes/books.js по образцу существующих.

// Экспортируем подключение, чтобы модели могли выполнять SQL-запросы.
module.exports = db;
