const form = document.querySelector('#form');
const taskTitle = document.querySelector('#taskTitle');
const taskDetails = document.querySelector('#taskDetails');
const priority = document.querySelector('#priority');
const tasksList = document.querySelector('#tasksList');
const dateToday = document.querySelector('#dateToday');
const emptyList = document.querySelector('#emptyList');

let allTasks = [];

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', doneTask);
tasksList.addEventListener('click', deleteTask);

dateToday.innerHTML = createDateFrame();
loadFromLS ();
checkEmptyList ();
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
    const typePriority = priority.value;
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
    priority.value = 'Low';
     //reset all input fields

     //check empty page
    checkEmptyList();
     //check empty page
    
}

function doneTask (event) {
   
    if (event.target.dataset.action !== 'done') return; 
     
    const parentBtns = event.target.closest('.task-item__buttons');
    const parentTaskText = parentBtns.previousElementSibling;
    parentTaskText.classList.toggle('task-text--done');
    
    //change status in the array
    const parentNode = parentTaskText.closest('.task-item');
    const index = allTasks.findIndex(task => task.id === Number(parentNode.id));
    allTasks[index].isDone = !allTasks[index].isDone;
    //change status in the array

}

function deleteTask (event) {
    
    if (event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('.task-item'); 
    parentNode.remove()

    //delete in the array
    const index = allTasks.findIndex(task => task.id === Number(parentNode.id));
    allTasks.splice(index, 1);
    //delete in the array

    checkEmptyList();

    //remove item in local storage
    saveToLS();
    //remove item in local storage
}

//Will be added
function editTask (event) {

}
//Will be added


function checkEmptyList () {
    if (allTasks.length === 0) {
        const emptyHTML = `<li id="emptyList" class="list-group-item empty-list">
                                <img src="./img/todo-empty-com.svg" alt="Empty" width="48" class="mt-3">
                                <div class="empty-list__title">List is empty</div>
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
    const tasksLS = JSON.parse(localStorage.getItem('tasks'));
   
    tasksLS.forEach(element => {
        allTasks.push(element);
        renderTask (element);
    });
}
//local storage


function renderTask (task) {
    const cssClass = task.isDone ? 'task-text--done' : 'task-text';

    //create HTML frame
    const taskHTML = `<li id=${task.id} class="task-item">
                                <div class=${cssClass}>
                                    <span class="task-title">${task.title}</span>
                                    <p class="task-details">${task.details}</p>
                                    <p class="task-priority">${task.priority}</p>
                                    <p class="task-date">Start date: ${task.data}</p>
                                </div>
                                <div class="task-item__buttons">
                                    <button type="button" data-action="done" class="btn-action">
                                        <img src="./img/icons/done.svg" alt="done" width="18" height="18">
                                    </button>
                                    <button type="button" data-action="delete" class="btn-action">
                                        <img src="./img/icons/delete.svg" alt="delete" width="18" height="18">
                                    </button>
                                </div>
                            </li>`;

    // Will be added in HTML frame
        //<button type="button" data-action="edit" class="btn-action">
        //<img src="./img/icons/edit.svg" alt="edit" width="18" height="18">
        // </button>
    // Will be added in HTML frame

    tasksList.insertAdjacentHTML('afterbegin', taskHTML);
    //create HTML frame

}