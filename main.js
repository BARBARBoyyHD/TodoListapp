// Select DOM elements and assign them to variables
let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let msg = document.getElementById("msg");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");

// Add an event listener to the form that prevents default submission and triggers form validation
form.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation();
});

// Function to validate the form inputs
let formValidation = () => {
  // Check if textInput is empty
  if (textInput.value === "") {
    console.log("failure");
    msg.innerHTML = "Task cannot be blank"; // Display error message
  } else {
    console.log("success");
    msg.innerHTML = ""; // Clear error message
    acceptData(); // Accept data if validation passes
    add.setAttribute("data-bs-dismiss", "modal"); // Close the modal
    add.click(); // Trigger a click event to close the modal

    // Reset the data-bs-dismiss attribute after closing the modal
    (() => {
      add.setAttribute("data-bs-dismiss", "");
    })();
  }
};

// Initialize an empty array to store task data
let data = [];

// Function to accept data and store it
let acceptData = () => {
  // Push a new task object to the data array
  data.push({
    Text: textInput.value, // Task text
    Date: dateInput.value, // Task date
    Description: textarea.value, // Task description
  });

  // Store the updated data array in localStorage
  localStorage.setItem("data", JSON.stringify(data));

  console.log(data);

  // Create and display tasks
  createTask();
};

// Function to create and display tasks
let createTask = () => {
  tasks.innerHTML = ""; // Clear existing tasks

  // Loop through the data array and create task elements
  data.map((x, y) => {
    return (tasks.innerHTML += `
        <div id=${y}>
              <span class="fw-bold">${x.Text}</span>
              <span class="small text-secondary">${x.Date}</span>
              <p>${x.Description}</p>
              <span class="option">
                <i onclick="editTask(this)"  data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
                <i onclick="deleteTask(this)" class="fas fa-trash"></i>
              </span>
            </div>
      `);
  });

  resetForm(); // Reset the form inputs
};

// Function to delete a task
let deleteTask = (e) => {
  let taskId = e.parentElement.parentElement.id; // Get the task id
  data.splice(taskId, 1); // Remove the task from the data array
  localStorage.setItem("data", JSON.stringify(data)); // Update localStorage
  createTask(); // Refresh the task list
};

// Function to edit a task
let editTask = (e) => {
  let selectedTask = e.parentElement.parentElement; // Get the selected task element
  let taskId = selectedTask.id; // Get the task id

  // Populate the form inputs with the selected task data
  textInput.value = selectedTask.children[0].innerHTML;
  dateInput.value = selectedTask.children[1].innerHTML;
  textarea.value = selectedTask.children[2].innerHTML;

  deleteTask(e); // Delete the selected task
  
  // Remove the task from the data array and update localStorage
  data.splice(taskId, 1);
  localStorage.setItem("data", JSON.stringify(data));
  createTask(); // Refresh the task list
};

// Function to reset the form inputs
let resetForm = () => {
  textInput.value = "";
  dateInput.value = "";
  textarea.value = "";
};

// Immediately-invoked function to initialize the task list from localStorage
(() => {
  data = JSON.parse(localStorage.getItem("data")) || []; // Load data from localStorage or initialize an empty array
  createTask(); // Create and display tasks
})();
