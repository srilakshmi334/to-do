const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

/**
 * add task
 * @returns alert to add task
 */
const addTask = () => {
    const task = inputBox.value.trim();

    // if there is no task, ask user to enter a task
    if (!task) {
        alert("Please write down a task");
        return;
    }

    const li = document.createElement("li"); // list element

    // create the components of the li
    li.innerHTML = `
        <div class="task-item">
            <input type="checkbox">
            <span>${task}</span>
        </div>
        <div class="features">
            <span class="edit-btn">Edit</span>
            <span class="del-btn">Delete</span>
            <span class="priority-btn"><button class="priorityBtn" title="Mark as priority"></button></span>
            <span class="calendar-btn" title="Select task deadline"><input type="date" class="datePicker"></span>
            <span class="notes-btn"><button class="notesBtn" title="Add task notes"></button></span>
            <div class="notesArea">
                <textarea placeholder="Add task notes here..."></textarea>
            </div>
        </div>
    
    `;

    listContainer.appendChild(li); // add the li to the list container
    inputBox.value = ""; // clear the text written in the input box once a task is added

    // define elements
    const checkbox = li.querySelector("input");
    const editBtn = li.querySelector(".edit-btn");
    const delBtn = li.querySelector(".del-btn");
    const priBtn = li.querySelector(".priorityBtn");
    const noteBtn = li.querySelector('.notesBtn');
    const taskSpan = li.querySelector("span");

    // event listener for task checkbox
    checkbox.addEventListener("click", function () {
        li.classList.toggle("completed", checkbox.checked); // check the task off as completed
        updateCounters(); // update counters for completion
    });

    // event listener for edit button
    editBtn.addEventListener("click", function () {

        // create edit prompt
        const update = prompt("Edit task:", taskSpan.textContent);

        // check if the user updates their task
        if (update !== null) {
            taskSpan.textContent = update; // re-write the task with the update
            li.classList.remove("completed"); // remove the completed status from the updated task

            checkbox.checked = false; // un-check the task checkbox
            updateCounters(); // update counters for completion
        }
    });


    // event listener for delete button
    delBtn.addEventListener("click", function () {

        // create confirm prompt
        if (confirm("Do you want to delete this task?")) {
            li.remove(); // remove task from li
            updateCounters(); // update counters for completion
        }
    });

    // event listener for priority button
    priBtn.addEventListener("click", function () {
        priBtn.classList.toggle("filled"); // set toggle for a filled star button
    });

    // event listener for notes button
    noteBtn.addEventListener("click", function () {
        const li = noteBtn.closest("li"); // find the li (box) that has the button (toy)
        const notesSection = li.querySelector(".notesArea");
        notesSection.classList.toggle("open"); // toggle for the "open" class
    });

    // call other methods when a task is added
    checkActiveTasks();
    checkPriorityTasks();
    saveData();

}

/**
 * update counters
 */
const updateCounters = () => {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;
    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
}

/**
 * view active tasks
 */
const checkActiveTasks = () => {
    const taskList = document.querySelectorAll("#list-container li");

    // check if the active toggle is enabled
    if (activeBtn.checked) {

        // check if there are no tasks in the list
        if (listContainer.children.length == 0) {
            alert("No active tasks");
            activeBtn.checked = false; // disable the toggle if there are no tasks
        }

        // check if there are tasks in the list
        else if (listContainer.children.length > 0) {

            // loop through the task list
            taskList.forEach(li => {
                const checkbox = li.querySelector("input");

                // if the task checkbox is not checked, remove the hide filter
                if (!checkbox.checked) {
                    li.classList.remove("hide"); // show the active task
                }

                // if the task checkbox is checked, add the hide filter
                else {
                    li.classList.add("hide"); // don't show the completed tasks
                }
            });
        }
    }
    else {

        // loop through the task list
        taskList.forEach(li => {
            const checkbox = li.querySelector("input");

            // whether or not the task checkbox is checked or not, remove the hide filter
            if (checkbox.checked || !checkbox.checked) {
                li.classList.remove("hide")
            }
        });
    }
}

const activeBtn = document.querySelector('.toggle-container input[type="checkbox"]');
activeBtn.addEventListener("click", checkActiveTasks);

/**
 * delete all tasks
 */
const deleteAllTasks = () => {
    const taskList = document.querySelectorAll("#list-container li");
    const listContainer = document.getElementById("list-container");

    // check if there are no tasks in the list
    if (listContainer.children.length == 0) {
        alert("No tasks to delete");
    }

    // check if there are tasks in the list
    else if (listContainer.children.length > 0) {

        // confirm deletion process for all tasks
        if (confirm("Are you sure you want to delete all tasks?") == true) {
            listContainer.innerHTML = ""; // empty the list
            localStorage.removeItem("program-elements"); // remove tasks from local storage
            updateCounters(); // update counters for completion

            // disable both toggles
            activeBtn.checked = false;
            priorityTasks.checked = false;
        }
        else {
            // don't change anything in the task list
        }
    }

}

const deleteAllBtn = document.querySelector('.delAll');
deleteAllBtn.addEventListener("click", deleteAllTasks);

/**
 * view priority tasks
 */
const checkPriorityTasks = () => {
    const taskList = document.querySelectorAll("#list-container li");

    // check if the priorty button is clicked
    if (priorityTasks.checked) {

        // check if there are any tasks in the list
        if (listContainer.children.length == 0) {
            alert("No priority tasks available");
            priorityTasks.checked = false; // disable the toggle button
        }

        // check if there are tasks in the list
        else if (listContainer.children.length > 0) {
            let priorityFound = false; // boolean for checking if the task is a priority

            // loop through the task list
            taskList.forEach(li => {
                const priBtn = li.querySelector(".priorityBtn");

                // check if the priority button is set with the filled toggle (it is a priority)
                if (priBtn.classList.contains("filled")) {
                    priorityFound = true; // set priority boolean to true  
                    li.classList.remove("hide"); // remove the hide filter on the priority tasks
                }
                else {
                    li.classList.add("hide"); // add the hide filter to hide the non-priority tasks
                }
            });

            // check if the priority boolean is false meaning there are no priority tasks
            if (!priorityFound) {

                // loop through the task list
                taskList.forEach(li => {
                    // remove the hide filter on the task list since all the tasks are not priority
                    li.classList.remove("hide");
                    priorityTasks.checked = false; // disable the toggle button
                });
            }
        }
    }
    else {

        // loop through the task list
        taskList.forEach(li => {
            const priBtn = li.querySelector(".priorityBtn");

            // whether or not the tasks are priority or not, remove the hide filter
            if (priBtn.classList.contains("filled") || !priBtn.classList.contains("filled")) {
                li.classList.remove("hide")
            }
        });
    }

}

const priorityTasks = document.querySelector('.pritoggle-container input[type="checkbox"]');
priorityTasks.addEventListener("click", checkPriorityTasks);

/**
 * shuffle tasks - based on both priority and completion
 */
const shuffleTasks = () => {
    const taskList = document.querySelectorAll("#list-container li");
    const listContainer = document.getElementById("list-container");

    const arr = Array.from(taskList); // new array with tasks

    // check if there are no tasks
    if (listContainer.children.length == 0) {
        alert("No tasks available for shuffling");
    }
    // check if any of the tasks don't have a deadline
    else if (checkDate()) {
        alert("Shuffle unavailable as at least one of the tasks has a missing deadline");
    }
    // check if there are tasks
    else if (listContainer.children.length > 0) {

        // loop through task list
        taskList.forEach(li => {
            const datePicker = li.querySelector('.datePicker');
            const priBtn = li.querySelector(".priorityBtn");
            const checkbox = li.querySelector("input");

            // check if the task is a priority and active
            if (priBtn.classList.contains("filled") && !checkbox.checked) {

                // sort the list 
                arr.sort((a, b) => {

                    // define both dates
                    let dateA = new Date(a.querySelector('.datePicker').value);
                    let dateB = new Date(b.querySelector('.datePicker').value);

                    // check the difference between the two dates to determine which one is earlier
                    return dateA - dateB;
                });

                listContainer.innerHTML = ''; // empty the list

                // from the sorted array, append each task to the new list
                arr.forEach(li => {
                    listContainer.appendChild(li);
                });
            }
            else if (priBtn.classList.contains("filled")) {

                // sort the list 
                arr.sort((a, b) => {

                    // define both dates
                    let dateA = new Date(a.querySelector('.datePicker').value);
                    let dateB = new Date(b.querySelector('.datePicker').value);

                    // check the difference between the two dates to determine which one is earlier
                    return dateA - dateB;
                });

                listContainer.innerHTML = ''; // empty the list

                // from the sorted array, append each task to the new list
                arr.forEach(li => {
                    listContainer.appendChild(li);
                });
            }

            // check if the task is not a priority but it is still active
            else if (!priBtn.classList.contains("filled") && !checkbox.checked) {

                // sort the list 
                arr.sort((a, b) => {

                    // define both dates
                    let dateA = new Date(a.querySelector('.datePicker').value);
                    let dateB = new Date(b.querySelector('.datePicker').value);

                    // check the difference between the two dates to determine which one is earlier
                    return dateA - dateB;
                });

                listContainer.innerHTML = ''; // empty the list

                // from the sorted array, append each task to the new list
                arr.forEach(li => {
                    listContainer.appendChild(li);
                });
            }

            // check if the task is already completed
            else if (checkbox.checked) {

                // sort the list 
                arr.sort((a, b) => {

                    // define both dates
                    let dateA = new Date(a.querySelector('.datePicker').value);
                    let dateB = new Date(b.querySelector('.datePicker').value);

                    // check the difference between the two dates to determine which one is earlier
                    return dateA - dateB;
                });

                listContainer.innerHTML = ''; // empty the list

                // from the sorted array, append each task to the new list
                arr.forEach(li => {
                    listContainer.appendChild(li);
                });
            }
        });

    }
}

const shuffleBtn = document.querySelector('.shuffle');
shuffleBtn.addEventListener("click", shuffleTasks);

/**
 * checks if there is a date for the task
 * @returns boolean of whether or not the date was found
 */
const checkDate = () => {
    const taskList = document.querySelectorAll("#list-container li");
    const arr = Array.from(taskList);
    let dateNotFound = false; // boolean that checks if the date for a task is found

    // loop through the array of tasks
    for (let i = 0; i < arr.length; i++) {
        const datePicker = arr[i].querySelector('.datePicker');

        // if there is no date value for one of the tasks
        if (!datePicker.value) {
            dateNotFound = true; // set the boolean to true
            break; // break the loop
        }
    }

    return dateNotFound; // return the boolean value
}

const sound = document.querySelector(".soundBtn");
sound.addEventListener("click", function () {
    sound.classList.toggle("off"); // set the toggle to "off"
    checkSound(); // call sound function
});

/**
 * program sounds
 */
const checkSound = () => {
    const sound = document.querySelector(".soundBtn");
    const audio = document.getElementById("click");

    // check if the sound has the additional class for "off"
    if (sound.classList.contains("off")) {
        audio.muted = true; // mute audio
    }
    else {
        audio.muted = false; // un-mute audio
    }
}

/**
 * help button info
 */
const help = document.querySelector(".helpBtn");
help.addEventListener("click", function () {
    alert("Welcome to TO-DO.\nThis app is for tracking all your day-to-day tasks, with features built in to help improve your productivity.\nHope you enjoy!");
});


/**
 * add current date feature 
 */
const listDate = document.getElementById('list-date');
const currentDate = new Date();

const formatDate = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

listDate.textContent = currentDate.toLocaleDateString(undefined, formatDate);

/**
 * new page button functionality
 * (needs some fixing)
 */
const newPage = document.querySelector(".newPageBtn");
newPage.addEventListener("click", function () {
    const htmlElements = document.documentElement.outerHTML;
    const extraWindow = window.open();
    extraWindow.document.write(htmlElements);
    extraWindow.document.close();
});

/**
 * save button functionality
 */
const save = document.querySelector(".saveBtn");
save.addEventListener("click", function () {
    if (confirm("Are you ready to save your progress?") == true) {
        // save the stuff
        saveData();
        alert("Progress saved!");
    }
    else {
        // do nothing
    }
});

/**
 * saves user data
 */
const saveData = () => {
    const elements = [];
    const taskList = document.querySelectorAll("#list-container li");

    taskList.forEach(li => {
        const checkbox = li.querySelector("input");
        const priBtn = li.querySelector(".priorityBtn").classList.contains("filled");
        const noteBtn = li.querySelector('.notesBtn');
        const taskSpan = li.querySelector("span").textContent;
        const datePicker = li.querySelector(".datePicker");
        const notesSection = li.querySelector(".notesArea textarea");

        elements.push({
            completed: checkbox.checked,
            filled: priBtn,
            notes: notesSection.value,
            text: taskSpan,
            selectedDate: datePicker.value
        });
    });

    localStorage.setItem("program-elements", JSON.stringify(elements));
}

/**
 * loads user data
 */
const loadData = () => {
    const savedElements = localStorage.getItem("program-elements");
    if (savedElements) {
        const elements = JSON.parse(savedElements);
        const listContainer = document.getElementById("list-container");

        listContainer.innerHTML = "";

        elements.forEach(element => {

            const li = document.createElement("li"); // list element

            // create the components of the li
            li.innerHTML = `
            <div class="task-item">
                <input type="checkbox">
                <span>${element.text}</span>
            </div>
            <div class="features">
                <span class="edit-btn">Edit</span>
                <span class="del-btn">Delete</span>
                <span class="priority-btn"><button class="priorityBtn" title="Mark as priority"></button></span>
                <span class="calendar-btn" title="Select task deadline"><input type="date" class="datePicker"></span>
                <span class="notes-btn"><button class="notesBtn" title="Add task notes"></button></span>
                <div class="notesArea">
                    <textarea placeholder="Add task notes here..."></textarea>
                </div>
            </div>
            `;

            listContainer.appendChild(li); // add the li to the list container
            inputBox.value = ""; // clear the text written in the input box once a task is added

            // define elements
            const checkbox = li.querySelector("input");
            const editBtn = li.querySelector(".edit-btn");
            const delBtn = li.querySelector(".del-btn");
            const priBtn = li.querySelector(".priorityBtn");
            const noteBtn = li.querySelector('.notesBtn');
            const taskSpan = li.querySelector("span");
            const datePicker = li.querySelector(".datePicker");
            const notesSection = li.querySelector(".notesArea textarea");

            checkbox.checked = element.completed;
            if (element.completed) {
                li.classList.add("completed");
            }

            if (element.filled) {
                priBtn.classList.add("filled");
            }

            if (element.selectedDate) {
                datePicker.value = element.selectedDate;
            }

            if (element.notes) {
                notesSection.value = element.notes;
            }


            // event listener for task checkbox
            checkbox.addEventListener("click", function () {
                li.classList.toggle("completed", checkbox.checked); // check the task off as completed
                updateCounters(); // update counters for completion
            });

            // event listener for edit button
            editBtn.addEventListener("click", function () {

                // create edit prompt
                const update = prompt("Edit task:", taskSpan.textContent);

                // check if the user updates their task
                if (update !== null) {
                    taskSpan.textContent = update; // re-write the task with the update
                    li.classList.remove("completed"); // remove the completed status from the updated task

                    checkbox.checked = false; // un-check the task checkbox
                    updateCounters(); // update counters for completion
                }
            });


            // event listener for delete button
            delBtn.addEventListener("click", function () {

                // create confirm prompt
                if (confirm("Do you want to delete this task?")) {
                    li.remove(); // remove task from li
                    updateCounters(); // update counters for completion
                }
            });

            // event listener for priority button
            priBtn.addEventListener("click", function () {
                priBtn.classList.toggle("filled"); // set toggle for a filled star button
            });

            // event listener for notes button
            noteBtn.addEventListener("click", function () {
                const li = noteBtn.closest("li"); // find the li (box) that has the button (toy)
                const notesSection = li.querySelector(".notesArea");
                notesSection.classList.toggle("open"); // toggle for the "open" class
            });

        });

        updateCounters();

    }
}

loadData();
