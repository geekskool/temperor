var $ = require('tinix')
var Template = require('temperor')

function start() {

    var mainDiv = new Template('Resp1ColMax640').append()

    var TodoInput = new Template('todo-input')

    TodoInput.willRender(function(elem) {
        var todoInput = $('input', elem)
        todoInput.on('change', function(e) {
            todo.append({todo: todoInput.value}, mainDiv)
            storeTodos()
            todoInput.value = ''
        })
    })

    TodoInput.append(null, mainDiv)

    var todo = new Template('todo')
    todo.willRender(function(elem) {
        $('.delete', elem).on('click', function(e) {
            todo.remove(elem)
            storeTodos()
        })

        $('.check', elem).on('click', function(e) {
            storeTodos()
        })

        elem.on('dblclick', function(e){
            $.display('.todo-main',elem, 'none')
            $.display('.edit-todo',elem, 'inline')
            $('.edit-todo',elem).focus()
            $('.edit-todo',elem).value = $('.todo-text',elem).textContent
            $('.edit-todo',elem).on('keypress', function(e){
                if (e.which === 13)
                updateTodo()
            })

            function updateTodo () {
                $.display('.todo-main',elem, 'block')
                $('.todo-text',elem).textContent = $('.edit-todo',elem).value
                storeTodos()
                $.display('.edit-todo',elem, 'none')
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
