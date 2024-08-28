"use strict";

let addBtn = document.querySelector("#todoAdd > button");
let addInput = document.querySelector(`#todoAdd > input[type="text"]`);
let addProjectBtn = document.getElementById("addProjectBtn");
let addProjectInput = document.getElementById("addProjectInput");
let todoList = document.getElementById("todoList");
let projects = document.getElementById("projects");


let db = JSON.parse(window.localStorage.getItem("database"));
if (db === null) {
    window.localStorage.setItem("database", JSON.stringify({}));
}

function loadDatabase() {
    let first = true;
    for (let key in db) {
        let li = createProjectItem(key);
        if (first) {
            li.querySelector("input[type='radio']").checked = true;
            first = false;
            loadTodoList(key);
        }
        projects.appendChild(li);
    }
}
loadDatabase();

function loadTodoList(prjName) {
    todoList.innerHTML = "";
    db[prjName].forEach(todo => {
        let li = createTodoItem(todo.name);
        if (todo.done) {
            li.classList.add("done");
            li.querySelector("input[type='checkbox']").checked = true;
        }
        todoList.appendChild(li);
    });
}

function getCurrentProject() {
    return projects.querySelector("input[type='radio']:checked").nextElementSibling.innerText;
}

function updateDatabase() {
    window.localStorage.setItem("database", JSON.stringify(db));
}

function createProjectItem(title) {
    let li = document.createElement("li");
    li.innerHTML = `
        <input type="radio" name="project"/>
        <span>${title}</span>
        <button>x</button>
    `;
    li.querySelector("input[type='radio']").onclick = () => {
        loadTodoList(title);
    }
    li.querySelector("button").onclick = () => {
        delete db[title];
        updateDatabase();
        projects.removeChild(li);
    }
    return li;
}


function createTodoItem(text) {
    let li = document.createElement("li");
    li.classList.add("todoItem");
    li.innerHTML = `
        <div>
              <input type="checkbox"/>
              <span>${text}</span>
        </div>
        <button>Edit</button>
    `;

    li.querySelector("input[type='checkbox']").onclick = () => {
        let currentPrj = getCurrentProject();
        let index = Array.from(todoList.children).indexOf(li);
        li.classList.toggle("done");
        db[currentPrj][index]["done"] = !db[currentPrj][index]["done"];
        updateDatabase();
    }

    // Edit button
    li.getElementsByTagName("button")[0].onclick = () => {
        let currentPrj = getCurrentProject();
        let index = Array.from(todoList.children).indexOf(li);

        let span = li.querySelector("span");
        let input = document.createElement("input");
        input.type = "text";
        input.value = span.innerHTML;
        span.replaceWith(input);
        input.addEventListener("focusout", (e) => {
            let span = document.createElement("span");
            span.innerHTML = e.target.value;
            e.target.replaceWith(span);
            db[currentPrj][index]["name"] = input.value;
            updateDatabase();
        })
    }

    return li;
}


addBtn.onclick = () => {
    let li = createTodoItem(addInput.value);
    let currentPrj = getCurrentProject();
    console.log(db[currentPrj]);
    db[currentPrj].push({ "name": addInput.value, "done": false });
    updateDatabase();
    addInput.value = "";
    todoList.appendChild(li);
}

addProjectInput.addEventListener("focusout", (e) => {
    addProjectInput.value = "";
    addProjectInput.classList.add("hidden");
})

addProjectInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let li = createProjectItem(addProjectInput.value);
        projects.appendChild(li);
        db[addProjectInput.value] = [];
        updateDatabase();
        addProjectInput.value = "";
        addProjectInput.classList.add("hidden");
    }
})

addProjectBtn.onclick = () => {
    addProjectInput.classList.remove("hidden");
    addProjectInput.focus();
}

