let tasks = [];
let editIndex = null;

window.onload = function () {
  loadTasks();
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
    task.id = tasks[editIndex].id;
    editIndex = null;
    updateTask(task);
  } else {
    createTask(task);
  }

  clearInputs();
}

function createTask(task) {
  showLoading(true);
  fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Task added:", data);
      alert("✅ Task added successfully!");
      loadTasks();
    })
    .catch(error => {
      console.error("Error adding task:", error);
      alert("❌ Failed to add task.");
    })
    .finally(() => {
      showLoading(false);
    });
}

function updateTask(task) {
  showLoading(true);
  fetch(`http://localhost:3000/api/tasks/${task.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
    .then(response => response.json())
    .then(data => {
      console.log("Task updated:", data);
      alert("✅ Task updated successfully!");
      loadTasks();
    })
    .catch(error => {
      console.error("Error updating task:", error);
      alert("❌ Failed to update task.");
    })
    .finally(() => {
      showLoading(false);
    });
}

function clearInputs() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("deadline").value = "";
  document.getElementById("priority").value = "Medium";
  document.getElementById("category").value = "";
  document.getElementById("title").focus(); // 🔥 focus automatique
}

function displayTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  const search = document.getElementById("search").value.toLowerCase();
  const filterPriority = document.getElementById("filter-priority").value;
  const filterCategory = document.getElementById("filter-category").value.toLowerCase();

  if (!Array.isArray(tasks)) {
    console.error("Erreur : tasks n'est pas un tableau", tasks);
    return;
  }

  tasks
    .filter(task =>
      task.title.toLowerCase().includes(search) &&
      (filterPriority === "" || task.priority === filterPriority) &&
      (filterCategory === "" || task.category.toLowerCase().includes(filterCategory))
    )
    .forEach((task, index) => {
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
          <button onclick="deleteTask(${task.id})">Delete</button>
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

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    showLoading(true);
    fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        alert("✅ Task deleted successfully!");
        loadTasks();
      })
      .catch(error => {
        console.error("Error deleting task:", error);
        alert("❌ Failed to delete task.");
      })
      .finally(() => {
        showLoading(false);
      });
  }
}

function loadTasks() {
  showLoading(true);
  fetch('http://localhost:3000/api/tasks')
    .then(response => response.json())
    .then(data => {
      if (data && Array.isArray(data.tasks)) {  // ✅ vérifier data.tasks et non data directement
        tasks = data.tasks;
        displayTasks();
      } else {
        console.error("Erreur : données inattendues reçues du serveur", data);
        tasks = [];
      }
    })
    .catch(error => {
      console.error("Error loading tasks:", error);
    })
    .finally(() => {
      showLoading(false);
    });
}


function filterTasks() {
  displayTasks();
}

function showLoading(isLoading) {
  const loadingDiv = document.getElementById("loading");
  if (loadingDiv) {
    loadingDiv.style.display = isLoading ? "block" : "none";
  }
}
