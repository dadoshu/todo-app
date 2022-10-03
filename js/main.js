// Поиск элементов на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

// Массив для хранения данных о задачах
let tasks = [];

// Проверка на наличие данных в localstorage о задачах созданных ранее. Если такие есть выводим их в разметку на странице
if (localStorage.getItem('tasks')) { 
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}  

// Проверка для вывода или удаления блока "Список дел пуст"
checkEmptyList();

// Прослушка на событие для добавление задачи
form.addEventListener('submit', addTask);

// Прослушка на событие для удаления задачи
tasksList.addEventListener('click', deleteTask);

// Прослушка на событие для изменения статуса выполнения задачи
tasksList.addEventListener('click', doneTask);

// Функции для вызова
function addTask(event)  {
    // Отменяем отправку формы, чтобы страница не перезагружалась при добавлении задачи
    event.preventDefault();

    // Достаем текст задачи из поля ввода добавления задачи
    const taskText =  taskInput.value;
    
    // Описываем задачу в виде объекта и задаем ему свойства
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }

    // Добавляем задачу (наш объект) в массив со всеми задачами
    tasks.push(newTask);

    // Сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage();

    // Рендерим задачу на странице
    renderTask (newTask);
    
    // Очищаем поле ввода и возвращаем на него фокус
    taskInput.value = "";
    taskInput.focus();

    // Проверяем наше приложение на наличие данных и в соответствии с результатом выводим блок список дел пуст, либо же не выводим его так как есть данные и они отобразятся вместо него
    checkEmptyList();
}

function deleteTask(event) {
    // Проверяем если клик был НЕ по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') return;

    // Находим тот самый объект который хотим удалить
    const parentNode = event.target.closest('.list-group-item');
    
    // Определяем ID задачи
    const id = Number(parentNode.id);

    // Удаляем задачу из массива задач через фильрацию массива
    tasks = tasks.filter((task) => task.id !== id);

    // Сохраняем список задач в хранилище браузера LocalStorage вызывая функцию saveToLocalStorage
    saveToLocalStorage();

    // Удаляем задачу из разметки
    parentNode.remove();
    
    // Проверка на пустоту в блоке. Вывод блока "Список дел пуст" в случае отсутствия задач
    checkEmptyList();
}

function doneTask(event) {
    // Проверяем что клик был НЕ по кнопке "Задача выполнена"
    if (event.target.dataset.action !== 'done') return;

    // Находим задачу к которой хотим применить действие "Выполнено"
    const parentNode = event.target.closest('.list-group-item');

    // Определяем ID задачи
    const id = Number(parentNode.id);

    // Находим объект с задачей в массиве
    const task = tasks.find((task) => task.id === id);

    // Меняем статус задачи в массиве с задачами
    task.done = !task.done;
    
    // Сохраняем данные текущих задач в хранилище браузера LocalStorage
    saveToLocalStorage();

    // Меняем состояние задачи в разметке на выполнено или НЕ выполнено
    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
    // Проверяем массив с задачами на наличие в нём данных и в зависимости от результата добавляем блок "Список дел пуст" в разметку или же удаляем этот блок со страницы
    if (tasks.length === 0)  {
        const emptyListHTML = `
                            <li id="emptyList" class="list-group-item empty-list">
			                    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
			                    <div class="empty-list__title">Список дел пуст</div>
		                    </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    // Записываем в Local Storage браузера данные из массива с задачами
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask (task) {
    // Формируем CSS класс для определения состояния задачи. Выполнена она или нет
    const cssClass = task.done ? "task-title task-title--done" : "task-title"; 

    // Формируем разметку для новой задачи
    const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                    <span class="${cssClass}">${task.text}</span>
                    <div class="task-item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="Done" width="18" height="18">
                        </button>
                    </div>
                </li>`;

    // Добавляем задачу на страницу
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}