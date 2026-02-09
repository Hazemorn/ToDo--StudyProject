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

dateToday.innerHTML = CreateDateFrame();

function CreateDateFrame () {
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
    const dateNow = CreateDateFrame();

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
    //create an object

    const cssClass = newTask.isDone ? 'task-text--done' : 'task-text';

    //create HTML frame
    const taskHTML = `<li id=${newTask.id} class="task-item">
                                <div class=${cssClass}>
                                    <span class="task-title">${newTask.title}</span>
                                    <p class="task-details">${newTask.details}</p>
                                    <p class="task-priority">${newTask.priority}</p>
                                    <p class="task-date">Start date: ${newTask.data}</p>
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

    //reset all input fields
    taskTitle.value = '';
    taskDetails.value = '';
    priority.value = 'Low';
     //reset all input fields

     //check empty page
    if (tasksList.children.length > 1) {
        emptyList.classList.add('none');
    }
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
    // console.log(index);
    if ( allTasks[index].isDone === false) {
        allTasks[index].isDone = true;
    } else {
        allTasks[index].isDone = false;
    }
        
    // console.log(allTasks);
    //change status in the array

}

function deleteTask (event) {
    
    if (event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('.task-item'); 
    parentNode.remove()


    if (tasksList.children.length >  1) {
        emptyList.classList.add('none');
    } else {
        emptyList.classList.remove('none');
    }

    //delete in the array
    const index = allTasks.findIndex(task => task.id === Number(parentNode.id));
    allTasks.splice(index);
    // console.log(allTasks);
    //delete in the array
}

//Will be added
function editTask (event) {

}
//Will be added

