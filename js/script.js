/**
 * Create a valid HTML input
 * 
 * @author Vincent Lepelley / Leyzou / vincent@lepelley.fr / https://vincent.lepelley.fr
 * @param {string} type HTML input type
 * @param {string} value Input text
 * @param {string} name Input name + id
 * @param {string} placeholder Input placeholder
 * @param {boolean} require optional, input is required or not
 * 
 * return HTML input
 */
function createInput(type, value = "", name =  "", placeholder = "", require = false)
{
    const input = document.createElement("input")
    input.setAttribute("type", type)
    input.setAttribute("style", "margin-right:10px")
    if (value !== "") { // Submit or base value
        input.setAttribute("value", value)
    }
    if (name !== "") {
        input.setAttribute("id", name)
        input.setAttribute("name", name)
    }
    if (placeholder !== "") {
        input.setAttribute("placeholder", placeholder)
    }
    if (require) {
        input.setAttribute("required", "true")
    }
    
    return input
}
/**
 * Create a task using <span id="id">value</span>'s model
 * 
 * @author Vincent Lepelley / Leyzou / vincent@lepelley.fr / https://vincent.lepelley.fr
 * @param {string} value Task's text
 * @param {string} id Task's ID (SQL and HTML)
 * @param {number} status Task's status (1 = normal, 2 = checked)
 * @return HTML content
 */
function createTask(value, id, status = 1)
{
    const task = document.createElement("span")
    const checkElt = createInput("checkbox")
    const spanElt = document.createElement("span")
    task.id = id
    spanElt.textContent = value
    task.classList.add("item")
    task.appendChild(checkElt)
    if (status == 2) { // if checked
        spanElt.setAttribute("style", "color:gray;text-decoration:line-through")
        checkElt.setAttribute("checked", "")
    }
    task.appendChild(checkElt)
    task.appendChild(spanElt)
    document.getElementById("list_task").appendChild(task)

    // We can edit the task by clicking it

    spanElt.addEventListener("click", function(e) {
        const updateTask = {
            id: task.id,
            content: e.target.textContent,
            status: 1
        }
        const result = prompt("Modifier la tâche", e.target.textContent)
        if (result === null) {

        }
        else if (result === "") {
            updateTask.status = 0
            ajaxPost("https://www.lepelley.fr/projects/to-do/post.php", updateTask, function(response) {
                document.getElementById("list_task").removeChild(task)
                //console.log(response)
            }, true)
        }
        else {
            ajaxPost("https://www.lepelley.fr/projects/to-do/post.php", updateTask, function(response) {
                spanElt.textContent = result
                //console.log(response)
            }, true)
        }
    })

    // We can show it resolved
    checkElt.addEventListener("change", function(e) {
        const updateTask = {
            id: task.id,
            content: spanElt.textContent,
            status: 1
        }
        if (e.target.checked) { // if check, task done
            updateTask.status = 2
            ajaxPost("https://www.lepelley.fr/projects/to-do/post.php", updateTask, function(response) {
                spanElt.setAttribute("style", "color:gray;text-decoration:line-through")
                //console.log(response)
            }, true)
        }
        else {
            ajaxPost("https://www.lepelley.fr/projects/to-do/post.php", updateTask, function(response) {
                spanElt.setAttribute("style", "color:black")
                //console.log(response)
            }, true)
        }
    })


    return task;
}

// Form
const addTaskElt = document.getElementById("add_task")
const formElt = document.getElementById("list_task")
const inputElt = createInput("text", "", "task", "Entrez votre tâche")
const submitElt = createInput("submit", "Ajouter")

const buttonElt = document.createElement("button")
buttonElt.textContent = "Ajouter une tâche"
addTaskElt.appendChild(buttonElt)


ajaxGet("https://www.lepelley.fr/projects/to-do/get.php", function (response) { // AJAX load task
    const tasks = JSON.parse(response);
    tasks.forEach(task => {
        createTask(task.content, task.id, task.status)
    })
})

buttonElt.addEventListener("click", function(e) {
    addTaskElt.removeChild(buttonElt)
    inputElt.setAttribute("autocomplete", "on")
    addTaskElt.appendChild(inputElt)
    addTaskElt.appendChild(submitElt)
    inputElt.focus()

    formElt.addEventListener("submit", function(e) {
        e.preventDefault()
        console.log(e.target.task.value)
        if (e.target.task.value !== "") {
            const task = {
                content: e.target.task.value,
                status: 1
            }

            ajaxPost("https://www.lepelley.fr/projects/to-do/post.php", task, function(response) { // AJAX add task
                const id = JSON.parse(response)
                createTask(task.content, id, 1)
            }, true)

            // Switch form and button
            inputElt.value = ""
            inputElt.setAttribute("autocomplete", "off")
            addTaskElt.removeChild(inputElt)
            addTaskElt.removeChild(submitElt)
            addTaskElt.appendChild(buttonElt)
        }
    })
})
