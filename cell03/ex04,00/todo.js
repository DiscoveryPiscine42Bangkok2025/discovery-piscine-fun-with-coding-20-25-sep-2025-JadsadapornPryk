function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// ---------- TASK MANAGEMENT ----------
function saveTodos() {
    const todos = [];
    document.querySelectorAll("#ft_list .todo").forEach(todo => {
        todos.push(todo.innerText);
    });
    setCookie("todos", JSON.stringify(todos), 7); // save for 7 days
}

function loadTodos() {
    const saved = getCookie("todos");
    if (saved) {
        JSON.parse(saved).forEach(text => {
            createTodo(text);
        });
    }
}

function createTodo(text) {
    const todo = document.createElement("div");
    todo.className = "todo";
    todo.innerText = text;

    // remove on click with confirmation
    todo.addEventListener("click", () => {
        if (confirm("Do you want to remove this TO DO?")) {
            todo.remove();
            saveTodos();
        }
    });

    document.getElementById("ft_list").appendChild(todo);
    saveTodos();
}

function newTodo() {
    const text = prompt("Enter a new TO DO:");
    if (text && text.trim() !== "") {
        createTodo(text.trim());
    }
}

// ---------- INIT ----------
window.onload = () => {
    loadTodos();
};
