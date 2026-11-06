# Пустой шаблон проекта

Пустая основа учебного веб-приложения. Здесь сохранена техническая структура
проекта, но нет ни одной предметной сущности, готовых страниц и бизнес-логики.
Ученик добавляет свою идею с нуля.

## Что уже есть

- Node.js, Express и синхронный SQLite через `better-sqlite3`;
- настройки через `.env` и `dotenv`;
- подключение к базе и создание файла `data/app.db`;
- раздача статики из `frontend/`;
- базовая страница `frontend/index.html`;
- палитра в CSS-переменных;
- общая функция `apiRequest()` для будущих запросов на фронтенде;
- обработка ошибок API.

## Чего нет

- таблиц и моделей;
- API-маршрутов;
- предметных страниц и JavaScript-логики;
- готовых компонентов интерфейса и иконок.

Папки `models/`, `routes/`, `data/`, `frontend/assets/img/` и
`frontend/assets/icon/` намеренно оставлены пустыми. Они понадобятся при
расширении проекта.

## Дерево файлов

```text
blank/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── config.js
├── db.js
├── index.js
├── models/                  пустая папка для будущих моделей
├── routes/                  пустая папка для будущих API-маршрутов
├── data/                    пустая папка для файла базы (создаётся при запуске)
└── frontend/
    ├── index.html
    └── assets/
        ├── css/
        │   ├── main.css
        │   └── colors.css
        ├── js/
        │   └── api.js
        ├── img/             пустая папка для изображений
        └── icon/            пустая папка для иконок
```

## Установка

Нужен Node.js версии 20 или новее.

```bash
cd blank
npm install
```

`better-sqlite3` содержит нативную часть. В новых версиях npm установочные
скрипты пакетов могут быть заблокированы. В `package.json` уже есть разрешение
для `better-sqlite3`. Если npm всё равно сообщает о блокировке:

```bash
npm install-scripts approve better-sqlite3
npm rebuild better-sqlite3
```

## Настройка .env

```bash
cp .env.example .env
```

В Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Настройки:

```dotenv
PORT=3000
DB_PATH=data/app.db
```

Если файла `.env` нет, используются значения по умолчанию.

## Запуск

```bash
npm start
```

Или с автоматическим перезапуском:

```bash
npm run dev
```

Откройте <http://localhost:3000>. При первом запуске автоматически создадутся
файл базы `data/app.db` и пустая база SQLite.

## Как добавить свою сущность

Пример: сущность `items` с полями `id`, `title`, `time`.

1. **Таблица.** Добавьте `CREATE TABLE IF NOT EXISTS` в `db.js`.
2. **Модель.** Создайте `models/item.js` с функциями CRUD:
   `createItem`, `getAllItems`, `getItemById`, `updateItem`, `deleteItem`.
3. **Маршрут.** Создайте `routes/items.js`:
   `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`.
   Проверка полей и формирование JSON-ответов пишутся прямо в маршрутах.
4. **Подключение.** В `index.js` добавьте:
   ```js
   const itemsRouter = require('./routes/items');
   app.use('/api/items', itemsRouter);
   ```
5. **Запросы.** В `frontend/assets/js/api.js` добавьте функции
   `getItems`, `createItem`, `updateItem`, `deleteItem`.
6. **Страница.** Добавьте форму и список в `index.html`, создайте отдельный
   JavaScript-файл для обработки событий и подключите его через `<script defer>`.

Держите те же принципы, что и в полном шаблоне:

- на бэкенде нет `async/await`, ORM, TypeScript и сборщиков;
- база и маршруты работают синхронно;
- вся логика маршрута находится в его файле;
- проверка данных выполняется на сервере, а ошибка возвращается статусом 400:
  `{ "error": "..." }`;
- фронтенд показывает ошибку простым способом, например через `alert`.