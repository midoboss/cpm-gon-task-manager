let tasks = [];
let editIndex = null;

window.onload = () => {
  const saved = localStorage.getItem("tasks");
  if (saved) tasks = JSON.parse(saved);
  displayTasks();
};

function addTask() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const deadline = document.getElementById("deadline").value;
  const priority = document.getElementById("priority").value;
  const category = document.getElementById("category").value.trim();

  if (!title || !deadline) {
    alert("Title and Deadline are required.");
    return;
  }

  const task = { title, description, deadline, priority, category };

  if (editIndex !== null) {
    tasks[editIndex] = task;
    editIndex = null;
  } else {
    tasks.push(task);
  }

  saveTasks();
  clearInputs();
  displayTasks();
}

function clearInputs() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("deadline").value = "";
  document.getElementById("priority").value = "Medium";
  document.getElementById("category").value = "";
}

function displayTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  const search = document.getElementById("search").value.toLowerCase();
  const filterPriority = document.getElementById("filter-priority").value;
  const filterCategory = document.getElementById("filter-category").value.toLowerCase();

  const filteredTasks = tasks.filter(task => {
    return (
      task.title.toLowerCase().includes(search) &&
      (filterPriority === "" || task.priority === filterPriority) &&
      (filterCategory === "" || task.category.toLowerCase().includes(filterCategory))
    );
  });

  filteredTasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
      <div class="title">${task.title}</div>
      <div>${task.description}</div>
      <div><strong>Deadline:</strong> ${task.deadline}</div>
      <div><strong>Priority:</strong> ${task.priority}</div>
      <div><strong>Category:</strong> ${task.category}</div>
      <div class="actions">
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function editTask(index) {
  const task = tasks[index];
  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description;
  document.getElementById("deadline").value = task.deadline;
  document.getElementById("priority").value = task.priority;
  document.getElementById("category").value = task.category;
  editIndex = index;
}

function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
  }
}

function filterTasks() {
  displayTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
