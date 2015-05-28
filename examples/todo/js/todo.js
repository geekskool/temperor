var $ = require('tinix')
var Template = require('temperor')

function start() {

    var mainDiv = new Template('Resp1ColMax640').append()

    var TodoInput = new Template('todo-input')

    TodoInput.willRender(function(elem) {
        var todoInput = $('input', elem)
        todoInput.on('keypress', function(e) {
            if (e.which === 13) {
                todo.append({todo: todoInput.value}, mainDiv)
                storeTodos()
                todoInput.value = ''
            }
        })
    })

    TodoInput.append(null, mainDiv)

    var todo = new Template('todo')
    todo.willRender(function(elem) {
        var todoView = elem.childNodes[1]
        var todoEdit = elem.childNodes[3]

        $('.delete', elem).on('click', function(e) {
            todo.remove(elem)
            storeTodos()
        })

        $('.check', elem).on('click', function(e) {
            storeTodos()
        })

        elem.on('dblclick', function(e){
            todoView.style.display = 'none'
            todoEdit.style.display = 'inline'
            todoEdit.focus()
            todoEdit.value = todoView.childNodes[3].textContent;
            todoEdit.on('keypress', function(e){
                if (e.which === 13)
                updateTodo()
            })

            function updateTodo () {
                todoEdit.style.display = 'none'
                todoView.style.display = 'block'
                todoView.childNodes[3].textContent = todoEdit.value
                storeTodos()
            }
        })
    })

    function storeTodos () {
        localStorage.setItem('todos',JSON.stringify(todo.getDataAll()))
    }

    JSON.parse(localStorage.getItem('todos')).forEach(function(elem){
        todo.append(elem, mainDiv);
    })
}

$.ready(start)
