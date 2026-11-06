// todo.js
// Логика страницы задач: добавление, отметка «выполнено» и удаление.
// Все изменения сразу сохраняются в localStorage.

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoEmpty = document.getElementById('todo-empty');

// Загружаем сохранённые задачи при открытии страницы.
let todoState = loadTodoState();

// Перерисовываем список после каждого изменения данных.
// Для текста задач используется textContent, поэтому HTML-код,
// введённый пользователем, не будет исполняться браузером.
function renderTodoList() {
  todoList.innerHTML = '';
  todoEmpty.hidden = todoState.tasks.length > 0;

  todoState.tasks.forEach(function (task) {
    const item = document.createElement('li');
    item.className = task.done ? 'todo-item todo-item--done' : 'todo-item';

    const label = document.createElement('label');
    label.className = 'todo-item__label';

    const checkbox = document.createElement('input');
    checkbox.className = 'todo-item__checkbox';
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', function () {
      task.done = checkbox.checked;
      saveTodoState(todoState);
      renderTodoList();
    });

    const text = document.createElement('span');
    text.className = 'todo-item__text';
    text.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'todo-item__delete';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Удалить';
    deleteButton.setAttribute('aria-label', 'Удалить задачу: ' + task.text);
    deleteButton.addEventListener('click', function () {
      removeTask(task.id);
    });

    label.append(checkbox, text);
    item.append(label, deleteButton);
    todoList.appendChild(item);
  });
}

// Удаляем задачу по её id.
function removeTask(id) {
  if (!confirm('Удалить задачу?')) {
    return;
  }

  todoState.tasks = todoState.tasks.filter(function (task) {
    return task.id !== id;
  });

  saveTodoState(todoState);
  renderTodoList();
}

// Добавление новой задачи через форму.
todoForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (!text) {
    alert('Введите текст задачи');
    return;
  }

  todoState.tasks.push({
    // Date.now() возвращает текущее время в миллисекундах.
    // Используем его как простой уникальный идентификатор задачи.
    id: String(Date.now()),
    text: text,
    done: false
  });

  saveTodoState(todoState);
  todoForm.reset();
  renderTodoList();
  todoInput.focus();
});

// Первый показ сохранённых задач.
renderTodoList();
