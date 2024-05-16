const addBtn = document.querySelector("#add-btn");
const newTaskInput = document.querySelector("#wrapper input");
const taskContainer = document.querySelector("#tasks");
const error = document.querySelector("#error");
const countValue = document.querySelector("#count-value");

let taskCount = 0;
let tasks = [];

const displayCount = () => {
  countValue.innerText = taskCount;
};

const saveTasksToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayCount(taskCount);
};

const loadTasksFromLocalStorage = () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks) {
    tasks = storedTasks;
    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      taskContainer.appendChild(taskElement);
      if (!task.completed) { // Check if the task is not completed
        taskCount++; // Increment taskCount only if the task is not completed
      }
    });
    displayCount();
  }
};

const createTaskElement = (taskObject) => {
  const { name } = taskObject;
  let completed = taskObject.completed; // Get the completed property from the taskObject
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.innerHTML = `
    <input type="checkbox" class="task-check" ${completed ? "checked" : ""}>
    <span class="taskname">${name}</span>
    <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
    <button class="delete"><i class="fa-solid fa-trash"></i></button>
  `;

  // Event listeners for edit and delete buttons
  const deleteButton = taskElement.querySelector(".delete");
  deleteButton.addEventListener("click", () => {
    taskElement.remove();
    const index = tasks.findIndex(task => task.name === name);
    if (index !== -1) {
      if (!completed) {
        taskCount -= 1;
      }
      tasks.splice(index, 1);
      saveTasksToLocalStorage();
      displayCount();
    }
  });

  const editButton = taskElement.querySelector(".edit");
  editButton.addEventListener("click", () => {
    if (!completed) {
      newTaskInput.value = name;
      taskElement.remove();
      const index = tasks.findIndex(task => task.name === name);
      if (index !== -1) {
        tasks.splice(index, 1);
        saveTasksToLocalStorage();
        taskCount -= 1;
        displayCount();
      }
    } else {
      error.textContent = "Cannot edit a completed task.";
      error.classList.add("active");
      setTimeout(() => {
        error.classList.remove("active");
        error.textContent = "Input cannot be empty!";
      }, 1500);
    }
  });

  // Event listener for checkbox
  const checkBox = taskElement.querySelector(".task-check");
  checkBox.addEventListener("change", () => {
    completed = !completed; // Toggle completion status
    taskObject.completed = completed; // Update taskObject
    saveTasksToLocalStorage(); // Save updated tasks
    if (completed) {
      taskCount -= 1;
    } else {
      taskCount += 1;
    }
    displayCount();
  });

  return taskElement;
};

const addTask = () => {
  const taskName = newTaskInput.value.trim();
  error.classList.remove("active");

  if (!taskName) {
    error.classList.add("active");
    setTimeout(() => {
      error.classList.remove("active");
    }, 1500);
    return;
  }

  const taskObject = { name: taskName, completed: false }; // New task object
  const taskElement = createTaskElement(taskObject);
  taskContainer.appendChild(taskElement);

  tasks.push(taskObject); // Push the task object
  saveTasksToLocalStorage();

  taskCount += 1;
  displayCount();
  newTaskInput.value = "";
};

addBtn.addEventListener("click", addTask);

window.onload = () => {
  taskCount = 0;
  displayCount();
  newTaskInput.value = "";
  loadTasksFromLocalStorage();
  
 // Delegating delete and edit button event listeners to task container
taskContainer.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("delete")) {
    const taskElement = target.closest(".task");
    if (taskElement) {
      const taskName = taskElement.querySelector(".taskname").innerText;
      const checkBox = taskElement.querySelector(".task-check");
      if (!checkBox.checked) {
        // Only decrement count if the task is not completed
        taskCount -= 1;
      }
      const index = tasks.indexOf(taskName);
      if (index !== -1) {
        tasks.splice(index, 1);
        saveTasksToLocalStorage();
        taskElement.remove();
        displayCount();
      }
    }
  } else if (target.classList.contains("edit")) {
    const taskElement = target.closest(".task");
    if (taskElement) {
      const taskName = taskElement.querySelector(".taskname").innerText;
      if (!taskElement.querySelector(".task-check").checked) {
        newTaskInput.value = taskName;
        newTaskInput.focus(); // Focus on the input field
    newTaskInput.click(); 
        tasks.splice(tasks.indexOf(taskName), 1);
        saveTasksToLocalStorage();
        taskElement.remove();
        displayCount();
      } else {
        error.textContent = "Cannot edit a completed task.";
        error.classList.add("active");
        setTimeout(() => {
          error.classList.remove("active");
          error.textContent = "Input cannot be empty!";
        }, 1500);
      }
    }
  }
})
};