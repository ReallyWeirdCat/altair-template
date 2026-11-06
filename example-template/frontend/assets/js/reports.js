// reports.js
// Логика страницы «Отчёты». mood — целое число от 1 до 5.

const reportForm = document.getElementById('report-form');
const reportTime = document.getElementById('report-time');
const reportMood = document.getElementById('report-mood');
const reportSubmit = document.getElementById('report-submit');
const reportCancel = document.getElementById('report-cancel');
const reportList = document.getElementById('report-list');
const reportEmpty = document.getElementById('report-empty');

let reports = [];

// null — добавляем новый отчёт, число — редактируем существующий.
let editingReportId = null;

function toDateTimeLocal(value) {
  const date = value instanceof Date ? value : new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function fromDateTimeLocal(value) {
  return new Date(value).toISOString();
}

function formatTime(isoString) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(isoString));
}

function setDefaultState() {
  reportTime.value = toDateTimeLocal(new Date());
  reportMood.value = '3';
}

function resetReportForm() {
  reportForm.reset();
  editingReportId = null;
  reportSubmit.textContent = 'Добавить';
  reportCancel.hidden = true;
  setDefaultState();
}

async function loadReports() {
  try {
    reports = await getReports();
    renderReports();
  } catch (error) {
    alert(error.message);
  }
}

function renderReports() {
  reportList.innerHTML = '';
  reportEmpty.hidden = reports.length > 0;

  reports.forEach(function (report) {
    const item = document.createElement('li');
    item.className = 'item';

    const body = document.createElement('div');
    body.className = 'item__body';

    // Строка настроения: текст и пять точек, заполненных по значению mood.
    const moodLine = document.createElement('p');
    moodLine.className = 'item__title';

    const moodBlock = document.createElement('span');
    moodBlock.className = 'mood';

    const moodText = document.createElement('span');
    moodText.textContent = 'Настроение: ' + report.mood + ' / 5';

    const dots = document.createElement('span');
    dots.className = 'mood__dots';
    dots.setAttribute('aria-hidden', 'true');

    for (let value = 1; value <= 5; value = value + 1) {
      const dot = document.createElement('span');
      dot.className = value <= report.mood ? 'mood__dot mood__dot--filled' : 'mood__dot';
      dots.appendChild(dot);
    }

    moodBlock.append(moodText, dots);
    moodLine.appendChild(moodBlock);

    const meta = document.createElement('div');
    meta.className = 'item__meta';

    const time = document.createElement('span');
    time.textContent = formatTime(report.time);

    meta.appendChild(time);
    body.append(moodLine, meta);

    const actions = document.createElement('div');
    actions.className = 'item__actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'button button--secondary';
    editButton.textContent = 'Изменить';
    editButton.addEventListener('click', function () {
      startEdit(report);
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'button button--icon';
    deleteButton.title = 'Удалить';
    deleteButton.setAttribute('aria-label', 'Удалить отчёт');

    const deleteIcon = document.createElement('img');
    deleteIcon.src = 'assets/icon/delete.svg';
    deleteIcon.alt = '';

    deleteButton.appendChild(deleteIcon);
    deleteButton.addEventListener('click', function () {
      removeReport(report.id);
    });

    actions.append(editButton, deleteButton);
    item.append(body, actions);
    reportList.appendChild(item);
  });
}

function startEdit(report) {
  editingReportId = report.id;
  reportTime.value = toDateTimeLocal(report.time);
  reportMood.value = String(report.mood);
  reportSubmit.textContent = 'Сохранить';
  reportCancel.hidden = false;
  reportTime.focus();
}

async function removeReport(id) {
  if (!confirm('Удалить отчёт?')) {
    return;
  }

  try {
    await deleteReport(id);

    if (editingReportId === id) {
      resetReportForm();
    }

    await loadReports();
  } catch (error) {
    alert(error.message);
  }
}

reportForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const selectedDate = new Date(reportTime.value);
  if (Number.isNaN(selectedDate.getTime())) {
    alert('Введите корректное время');
    return;
  }

  // value у select — строка, поэтому превращаем её в число.
  const mood = Number(reportMood.value);

  if (!Number.isInteger(mood) || mood < 1 || mood > 5) {
    alert('Настроение должно быть целым числом от 1 до 5');
    return;
  }

  const report = {
    time: fromDateTimeLocal(reportTime.value),
    mood: mood
  };

  try {
    if (editingReportId === null) {
      await createReport(report);
    } else {
      await updateReport(editingReportId, report);
    }

    resetReportForm();
    await loadReports();
  } catch (error) {
    alert(error.message);
  }
});

reportCancel.addEventListener('click', function () {
  resetReportForm();
});

// Начальная загрузка страницы.
setDefaultState();
loadReports();

// Пример своего поля отчёта: добавьте в таблицу reports колонку comment TEXT,
// затем передавайте comment через модель, маршрут и этот объект report.
