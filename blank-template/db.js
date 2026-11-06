// db.js
// Этот файл отвечает только за базу данных:
// 1) создаёт папку для файла БД, если её нет;
// 2) подключается к SQLite через better-sqlite3;
// 3) будет создавать таблицы, когда вы добавите свои сущности.
//
// SQLite — база данных, которая хранится в одном файле (по умолчанию data/app.db).
// better-sqlite3 — синхронная библиотека: результат запроса возвращается сразу,
// без промисов и async/await. Для учебного проекта это делает код понятнее.

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('./config');

// Перед открытием файла убеждаемся, что папка data/ существует.
// recursive: true создаёт все недостающие папки по указанному пути.
fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });

// new Database(...) открывает файл базы. Если файла ещё нет, SQLite создаст его.
const db = new Database(config.dbPath);

// TODO: В пустом шаблоне таблиц пока нет — здесь нет ни одной предметной сущности.
// Как только вы придумаете сущность, добавьте её таблицу по образцу:
//
// db.exec(`
//   CREATE TABLE IF NOT EXISTS items (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     title TEXT NOT NULL,
//     time TEXT NOT NULL
//   );
// `);
//
// CREATE TABLE IF NOT EXISTS создаёт таблицу только тогда, когда её ещё нет,
// поэтому такой код безопасно выполнять при каждом запуске сервера.
// После этого создайте models/item.js и routes/items.js.

// Экспортируем подключение, чтобы будущие модели могли выполнять SQL-запросы.
module.exports = db;
