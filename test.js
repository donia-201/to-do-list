
let tasks = [];


 function renderAllTasks() {
    document.getElementById("daily" ).innerHTML="";
    document.getElementById("weekly").innerHTML="";
    document.getElementById("challenges").innerHTML="";  
    document.getElementById("stretch-tasks").innerHTML="";
    document.getElementById("goals").innerHTML="";
    
    tasks.forEach(taskObject => {
        const taskElement = createTaskElement(taskObject);
        const targetList= document.getElementById(taskObject.category);
            if(targetList){
                targetList.appendChild(taskElement);
            } else{
                console.warn("missing container for category ", taskObject.category);
            }
    });
}


function renderStats() {
    console.log("renderStats called");

    const today = new Date().toISOString().slice(0, 10); 
    const tasksAddedToday = tasks.filter(task => task.dateAdded === today).length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const achievementRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const el1 = document.getElementById("tasks-added-today");
    const el2 = document.getElementById("tasks-completed");
    const el3 = document.getElementById("achievement-rate");

    if (!el1 ||  !el2 ||  !el3) {
        console.error("One of the stats elements is missing!");
        return;
    }

    el1.textContent = tasksAddedToday + "  task / tasks";
    el2.textContent = completedTasks + "  task / tasks";
    el3.textContent = achievementRate + " %";
}


function createTaskElement(taskObject) {
    const item = document.createElement("div");
    item.className = "item";

    const leftSide = document.createElement("div");
    item.className = "leftSide";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name= checkbox;
    checkbox.checked = taskObject.completed;

    
    checkbox.addEventListener('change', () => {
        taskObject.completed = checkbox.checked;
        saveAndRerender(); 
    });

    const text = document.createElement("span");
    text.textContent = taskObject.text;
    if (taskObject.completed) {
        text.style.textDecoration = "line-through";
    }

    const controls = document.createElement("div");
    controls.className = "controls";

    const editBtn = document.createElement("i");
    editBtn.className = "fa fa-pencil";
    editBtn.onclick = () => {
        const newText = prompt("Edit the task", taskObject.text);
        if (newText !== null && newText.trim() !== "") {
            taskObject.text = newText.trim();
            saveAndRerender(); 
                }
    };

    const deleteBtn = document.createElement("i");
    deleteBtn.className = "fa fa-trash";
    deleteBtn.onclick = () => {
        if (confirm("Are you sure you want to delete this task?")) {
            showNotification("Task Was Deleted Successfully", "error");

            tasks = tasks.filter(t => t !== taskObject);
            saveAndRerender(); 
        }
    };

    leftSide.appendChild(checkbox);
    leftSide.appendChild(text);
    controls.appendChild(editBtn);
    controls.appendChild(deleteBtn);
    item.appendChild(leftSide);
    item.appendChild(controls);

    return item;
}

function handleAddTask(event) {
    event.preventDefault();
    const form= event.target.closest("form");
    console.log("Form element:", form);
    console.log("Category:", form?.dataset?.category);

    const inputField = form.querySelector("input[type='text']")
    const taskText = inputField.value.trim();

    if (taskText === "") {
        alert("Please type something first.");
        return;
    }

    const newTaskObject = {
        text: taskText,
        completed: false,
        dateAdded: new Date().toISOString().slice(0, 10) ,
        category: form.dataset.category
    };

    tasks.push(newTaskObject);

    inputField.value = "";
    saveAndRerender(); 
    showNotification("Task was Added Successfully", "success");

}


function saveAndRerender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderAllTasks();
    renderStats();
}


function loadTasks() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    saveAndRerender();
}


window.addEventListener("DOMContentLoaded", loadTasks);

const form = document.querySelectorAll('.add-task-form');
form.forEach(form =>{
    form.addEventListener('submit', function(event){
        event.preventDefault();
    });
}
);

function showNotification(message, type) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = ""; 
    notification.classList.add(type, "show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

