// api.js
// Здесь собраны все запросы к серверу. Страницы не работают с fetch напрямую:
// они вызывают готовые функции вроде getTasks() или createNote().
//
// API (Application Programming Interface) — договор между клиентом и сервером:
// по каким адресам и в каком формате они обмениваются данными.
//
// fetch — встроенная функция браузера для HTTP-запроса. Она возвращает Promise.
// Promise — объект, который представляет результат, появляющийся позже,
// когда сервер ответит. Слово await приостанавливает функцию до этого момента.
// async перед функцией разрешает использовать await внутри неё.

// Общая функция запроса. Она:
// 1) отправляет fetch;
// 2) превращает ответ сервера из JSON-строки в JavaScript-объект;
// 3) если сервер ответил ошибкой, выбрасывает Error с русским текстом.
async function apiRequest(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      // Говорим серверу, что тело запроса отправлено в формате JSON.
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    });
  } catch (networkError) {
    // Сюда попадаем, если сервер выключен или пропала сеть.
    throw new Error('Не удалось связаться с сервером. Проверьте, запущен ли он.');
  }

  // 204 No Content — успешный ответ без тела (так работает удаление).
  if (response.status === 204) {
    return null;
  }

  // response.json() тоже асинхронный, поэтому используем await.
  const data = await response.json().catch(() => null);

  // response.ok истинно для статусов 200–299.
  if (!response.ok) {
    const message = data && data.error ? data.error : 'Ошибка запроса к серверу';
    throw new Error(message);
  }

  return data;
}

// ---------- Задачи (tasks) ----------

// GET /api/tasks — прочитать список.
async function getTasks() {
  return apiRequest('/api/tasks');
}

// POST /api/tasks — создать задачу.
async function createTask(task) {
  return apiRequest('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(task)
  });
}

// PUT /api/tasks/:id — обновить задачу.
async function updateTask(id, task) {
  return apiRequest(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task)
  });
}

// DELETE /api/tasks/:id — удалить задачу.
async function deleteTask(id) {
  return apiRequest(`/api/tasks/${id}`, {
    method: 'DELETE'
  });
}

// ---------- Заметки (notes) ----------

async function getNotes() {
  return apiRequest('/api/notes');
}

async function createNote(note) {
  return apiRequest('/api/notes', {
    method: 'POST',
    body: JSON.stringify(note)
  });
}

async function updateNote(id, note) {
  return apiRequest(`/api/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(note)
  });
}

async function deleteNote(id) {
  return apiRequest(`/api/notes/${id}`, {
    method: 'DELETE'
  });
}

// ---------- Отчёты (reports) ----------

async function getReports() {
  return apiRequest('/api/reports');
}

async function createReport(report) {
  return apiRequest('/api/reports', {
    method: 'POST',
    body: JSON.stringify(report)
  });
}

async function updateReport(id, report) {
  return apiRequest(`/api/reports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(report)
  });
}

async function deleteReport(id) {
  return apiRequest(`/api/reports/${id}`, {
    method: 'DELETE'
  });
}

// Пример, как добавить fetch-запрос для новой сущности:
//
// async function getBooks() {
//   return apiRequest('/api/books');
// }
//
// async function createBook(book) {
//   return apiRequest('/api/books', {
//     method: 'POST',
//     body: JSON.stringify(book)
//   });
// }
