// api.js
// Здесь будет собрана работа с сервером. В пустом шаблоне есть только общая
// функция запроса — без функций конкретных сущностей.
//
// API (Application Programming Interface) — договор между клиентом и сервером:
// по каким адресам и в каком формате они обмениваются данными.
//
// fetch — встроенная функция браузера для HTTP-запроса. Она возвращает Promise.
// Promise — объект, представляющий результат, который появится позже.
// await приостанавливает функцию до ответа сервера, а async разрешает await.

// Общая функция запроса. Она:
// 1) отправляет fetch;
// 2) превращает ответ сервера из JSON-строки в JavaScript-объект;
// 3) если сервер ответил ошибкой, выбрасывает Error с текстом ошибки.
async function apiRequest(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      // Сообщаем серверу, что тело запроса отправлено в формате JSON.
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    });
  } catch (networkError) {
    // Сюда попадаем, если сервер выключен или пропала сеть.
    throw new Error('Не удалось связаться с сервером. Проверьте, запущен ли он.');
  }

  // 204 No Content — успешный ответ без тела (обычно так отвечает удаление).
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

// Когда появятся собственные сущности, добавьте функции по образцу.
// Например, для сущности items:
//
// async function getItems() {
//   return apiRequest('/api/items');
// }
//
// async function createItem(item) {
//   return apiRequest('/api/items', {
//     method: 'POST',
//     body: JSON.stringify(item)
//   });
// }
//
// async function updateItem(id, item) {
//   return apiRequest(`/api/items/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(item)
//   });
// }
//
// async function deleteItem(id) {
//   return apiRequest(`/api/items/${id}`, {
//     method: 'DELETE'
//   });
// }
