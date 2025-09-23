
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie =
        `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const cname = name + "=";
    const decoded = decodeURIComponent(document.cookie || "");
    const parts = decoded.split(";").map(s => s.trim());
    for (const p of parts) {
        if (p.indexOf(cname) === 0) return p.substring(cname.length);
    }
    return "";
}


window.onload = function () {
    const raw = getCookie("todos");
    if (raw) {
        try {

            JSON.parse(raw).slice().reverse().forEach(task => addTask(task, false));
        } catch (e) {
            console.error("Parse error:", e);
        }
    }
};


function newToDo() {
    const task = prompt("Enter your TO DO:");
    if (task && task.trim()) {
        addTask(task.trim(), true);
    }
}


function addTask(task, save) {
    const list = document.getElementById("ft_list");
    const div = document.createElement("div");
    div.textContent = task;


    div.onclick = function () {
        if (confirm("Do you want to remove this TO DO?")) {
            div.remove();
            saveTasks();
        }
    };

    list.prepend(div);
    if (save) saveTasks();
}

//
