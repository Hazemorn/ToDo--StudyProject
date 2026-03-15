const form = document.querySelector('#form');
const taskTitle = document.querySelector('#taskTitle');
const taskDetails = document.querySelector('#taskDetails');
const priorityAdd = document.querySelector('#priority--add');
const priorityFind = document.querySelector('#priority--find')
const tasksList = document.querySelector('#tasksList');
const dateToday = document.querySelector('#dateToday');
const emptyList = document.querySelector('#emptyList');
const countStatus = document.querySelector('.status__container');
const findTask = document.querySelector('[name="findByTitle"]');
const formFindTask = document.querySelector('#form-find');


let allTasks = [];
let statusTasks = [0, 0, 0];// completed, pending, created

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', doneTask);
tasksList.addEventListener('click', deleteTask);
formFindTask.addEventListener('submit', findByTitle);

dateToday.innerHTML = createDateFrame();
loadFromLS();
checkEmptyList();
function createDateFrame () {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    const formatted = `${day}-${month}-${year}`;
    return formatted
}

function addTask (event) {
    event.preventDefault();
    const textTitle = taskTitle.value;
    const textDetails = taskDetails.value;
    const typePriority = priorityAdd.value;
    const dateNow = createDateFrame();

    //create an object
    const newTask = {
        id: Date.now(),
        title: textTitle,
        details: textDetails,
        priority: typePriority,
        isDone: false,
        data: dateNow
    }
    allTasks.push(newTask);
    saveToLS();
    //create an object
    renderTask (newTask);
    //reset all input fields
    taskTitle.value = '';
    taskDetails.value = '';
    priorityAdd.value = 'Low';
     //reset all input fields
    
    statusTasks[1] = statusTasks[1] + 1;
    statusTasks[2] = statusTasks[2] + 1;
    renderTasksStatus();
    countStatus.innerHTML = renderTasksStatus();
    checkEmptyList();
    
}

function doneTask (event) {
   
    if (event.target.dataset.action !== 'done') return; 
     
    const parentBtns = event.target.closest('.task__item__buttons');
    const parentTaskText = parentBtns.previousElementSibling;
    parentTaskText.classList.toggle('task__text--done');
    
    //change status in the array
    const parentNode = parentTaskText.closest('.task__item');
    const index = allTasks.findIndex(task => task.id === Number(parentNode.id));
    allTasks[index].isDone = !allTasks[index].isDone;
    //change status in the array
    statusTasks[0] = allTasks[index].isDone ? statusTasks[0] + 1 : statusTasks[0] - 1 ;
    statusTasks[1] = allTasks[index].isDone ? statusTasks[1] - 1 : statusTasks[1] + 1 ;
    renderTasksStatus();
    countStatus.innerHTML = renderTasksStatus();
}

function deleteTask (event) {
    
    if (event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('.task__item'); 
    parentNode.remove()

    //delete in the array
    const index = allTasks.findIndex(task => task.id === Number(parentNode.id));
    allTasks.splice(index, 1);
    //delete in the array
    checkEmptyList();
    statusTasks.forEach((value, index, array) => {
        array[index] = value - 1; 
        if (array[index] < 0) {
            array[index] = 0;
        } 
    });
    renderTasksStatus();
    countStatus.innerHTML = renderTasksStatus();
    //remove item in local storage
    saveToLS();
    //remove item in local storage
}


function checkEmptyList () {
    if (allTasks.length === 0) {
        const emptyHTML = `<li id="emptyList" class="list-group-item empty_list">
                                <img src="./img/todo-empty-com.svg" alt="Empty" width="48" class="mt-3">
                                <div class="empty_list__title">List is empty</div>
                            </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyHTML)
    } else {
        const emptyListEL = document.querySelector('#emptyList');
        emptyListEL ? emptyListEL.remove() : null ;
    }
}

//local storage
function saveToLS () {
    localStorage.setItem('tasks', JSON.stringify(allTasks));
}

function loadFromLS () {
    statusTasks.forEach((elem) => elem = 0);
    const tasksLS = JSON.parse(localStorage.getItem('tasks'));
   
    tasksLS.forEach(element => {
        allTasks.push(element);
        statusTasks[2] = statusTasks[2] + 1;
        console.log( element.isDone);
        element.isDone ? statusTasks[0] + 1 : statusTasks[1] + 1;
        renderTask (element);
    });
    renderTasksStatus();
    countStatus.innerHTML = renderTasksStatus();
}
//local storage

function renderTask (task) {
    const cssClass = task.isDone ? 'task__text--done' : 'task__text';

    //create HTML frame
    const taskHTML = `<li id=${task.id} class="task__item">
                                <div class=${cssClass}>
                                    <span class="task__title">${task.title}</span>
                                    <p class="task__details">${task.details}</p>
                                    <p class="task__priority">${task.priority}</p>
                                    <p class="task__date">Start date: ${task.data}</p>
                                </div>
                                <div class="task__item__buttons">
                                    <button type="button" data-action="done" class="btn-action">
                                        <img src="./img/icons/done.svg" alt="done" width="18" height="18">
                                    </button>
                                    <button type="button" data-action="delete" class="btn-action">
                                        <img src="./img/icons/delete.svg" alt="delete" width="18" height="18">
                                    </button>
                                </div>
                            </li>`;

    tasksList.insertAdjacentHTML('afterbegin', taskHTML);
    //create HTML frame

}
//sorting
function sortItems () {
    tasksList.innerHTML = ''; 
    const filteringPriority = allTasks.filter(item => {
        return priorityFind.value === 'By priority' || item.priority === priorityFind.value}).map(renderTask)
    checkNoResult (filteringPriority);
}  
//sorting

//findByTitle
function findByTitle (event) {
    event.preventDefault();
    tasksList.innerHTML = ''; 
    const filteringByTitle = allTasks.filter(item => {
        return item.title.trim().toLowerCase() === findTask.value.trim().toLowerCase()}).map(renderTask)
    checkNoResult (filteringByTitle);
}

function checkNoResult (filteredArray) {
    if (filteredArray.length === 0) {
        const emptyHTML = `<li id="emptyList" class="list-group-item empty_list">
                                <img src="./img/todo-empty-com.svg" alt="Empty" width="48" class="mt-3">
                                <div class="empty_list__title">No result</div>
                            </li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyHTML)
        formFindTask.value = '';
        }
}

//findByTitle

//create/pending/done counter
function renderTasksStatus () {
    console.log(statusTasks);
    countStatus.innerHTML = '';
    return `
        <div class="stats status--done">
            <h1>completed tasks</h1>
            <p>${statusTasks[0]}</p>
        </div>
    
        <div class="stats status--pending">
            <h1>pending tasks</h1>
            <p>${statusTasks[1]}</p>
        </div>
    
        <div class="stats status--created">
            <h1>created tasks</h1>
            <p>${statusTasks[2]}</p>
        </div>
    `
}
//create/pending/done counter

//------------------------------
//pagination by 5 tasks
//validation