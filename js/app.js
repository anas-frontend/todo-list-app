var tasks = [];
var lastId = 0;
var currentFilter = "all";

var taskInput = document.getElementById("taskInput");
var priorityInput = document.getElementById("priorityInput");
var addBtn = document.getElementById("addBtn");
var taskList = document.getElementById("taskList");
var errorMsg = document.getElementById("errorMsg");
var taskCounter = document.getElementById("taskCounter");
var clearDoneBtn = document.getElementById("clearDoneBtn");
var filterButtons = document.querySelectorAll(".filterBtn");


function addTask() {
  var taskText = taskInput.value.trim();

  if (taskText === "") {
    errorMsg.textContent = "Please write a task first";
    return;
  }

  lastId = lastId + 1;

  var newTask = {
    id: lastId,
    text: taskText,
    priority: priorityInput.value,
    isDone: false,
    isEditing: false
  };

  tasks.push(newTask);

  taskInput.value = "";
  errorMsg.textContent = "";
  taskInput.focus();

  showTasks();
}


function deleteTask(id) {
  var newTasksArray = [];

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id !== id) {
      newTasksArray.push(tasks[i]);
    }
  }

  tasks = newTasksArray;
  showTasks();
}


function toggleTaskDone(id) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].isDone = !tasks[i].isDone;
    }
  }
  showTasks();
}


function editTask(id) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].isEditing = true;
    }
  }
  showTasks();
}


function saveEditedTask(id, newText) {
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      var trimmed = newText.trim();
      if (trimmed !== "") {
        tasks[i].text = trimmed;
      }
      tasks[i].isEditing = false;
    }
  }
  showTasks();
}


function getFilteredTasks() {
  if (currentFilter === "all") {
    return tasks;
  }

  var filtered = [];

  for (var i = 0; i < tasks.length; i++) {
    if (currentFilter === "completed" && tasks[i].isDone === true) {
      filtered.push(tasks[i]);
    } else if (currentFilter === "pending" && tasks[i].isDone === false) {
      filtered.push(tasks[i]);
    }
  }

  return filtered;
}


function showTasks() {
  taskList.innerHTML = "";

  var tasksToShow = getFilteredTasks();

  if (tasksToShow.length === 0) {
    var emptyLine = document.createElement("li");
    emptyLine.className = "empty-text";
    emptyLine.textContent = "No tasks here right now";
    taskList.appendChild(emptyLine);
  } else {
    for (var i = 0; i < tasksToShow.length; i++) {
      var task = tasksToShow[i];

      var li = document.createElement("li");
      li.className = "task-item";
      if (task.isDone === true) {
        li.className = "task-item done";
      }

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.isDone;
      checkbox.setAttribute("aria-label", "Mark as done: " + task.text);
      checkbox.addEventListener("change", function () {
        var parentLi = this.closest(".task-item");
        var taskId = Number(parentLi.getAttribute("data-id"));
        toggleTaskDone(taskId);
      });

      var textSpan;

      if (task.isEditing === true) {
        textSpan = document.createElement("input");
        textSpan.type = "text";
        textSpan.className = "task-edit-input";
        textSpan.maxLength = 60;
        textSpan.value = task.text;

        textSpan.addEventListener("keydown", function (event) {
          if (event.key === "Enter") {
            this.blur();
          }
          if (event.key === "Escape") {
            // put the old text back, then blur saves the same text
            var parentLi = this.closest(".task-item");
            var taskId = Number(parentLi.getAttribute("data-id"));
            for (var k = 0; k < tasks.length; k++) {
              if (tasks[k].id === taskId) {
                this.value = tasks[k].text;
              }
            }
            this.blur();
          }
        });

        textSpan.addEventListener("blur", function () {
          var parentLi = this.closest(".task-item");
          var taskId = Number(parentLi.getAttribute("data-id"));
          saveEditedTask(taskId, this.value);
        });
      } else {
        textSpan = document.createElement("span");
        textSpan.className = "task-text";
        textSpan.textContent = task.text;
      }

      var priorityTag = document.createElement("span");
      priorityTag.className = "priority-tag priority-" + task.priority;
      priorityTag.textContent = task.priority;

      var editButton = document.createElement("button");
      editButton.className = "editBtn";
      editButton.setAttribute("aria-label", "Edit task");
      editButton.textContent = "✏️";
      editButton.addEventListener("click", function () {
        var parentLi = this.closest(".task-item");
        var taskId = Number(parentLi.getAttribute("data-id"));
        editTask(taskId);
      });

      var deleteButton = document.createElement("button");
      deleteButton.className = "deleteBtn";
      deleteButton.setAttribute("aria-label", "Delete task");
      deleteButton.textContent = "🗑️";
      deleteButton.addEventListener("click", function () {
        var parentLi = this.closest(".task-item");
        var taskId = Number(parentLi.getAttribute("data-id"));
        deleteTask(taskId);
      });

      li.setAttribute("data-id", task.id);

      li.appendChild(checkbox);
      li.appendChild(textSpan);
      li.appendChild(priorityTag);
      li.appendChild(editButton);
      li.appendChild(deleteButton);

      taskList.appendChild(li);
    }
  }

  var editingInput = taskList.querySelector(".task-edit-input");
  if (editingInput) {
    editingInput.focus();
    editingInput.select();
  }

  updateCounter();
}


function updateCounter() {
  var doneCount = 0;

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].isDone === true) {
      doneCount = doneCount + 1;
    }
  }

  taskCounter.textContent = "Tasks: " + tasks.length + " (Completed: " + doneCount + ")";
}


function clearDoneTasks() {
  var remainingTasks = [];

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].isDone === false) {
      remainingTasks.push(tasks[i]);
    }
  }

  tasks = remainingTasks;
  showTasks();
}


addBtn.addEventListener("click", function () {
  addTask();
});

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

clearDoneBtn.addEventListener("click", function () {
  clearDoneTasks();
});

for (var i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener("click", function () {
    for (var j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove("active");
    }

    this.classList.add("active");

    currentFilter = this.getAttribute("data-filter");

    showTasks();
  });
}


tasks.push({ id: 1, text: "Design the homepage", priority: "important", isDone: false, isEditing: false });
tasks.push({ id: 2, text: "Review emails", priority: "normal", isDone: true, isEditing: false });
tasks.push({ id: 3, text: "Submit the project", priority: "urgent", isDone: false, isEditing: false });
lastId = 3;

showTasks();
