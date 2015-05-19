var $ = require('../../../lib/tinix.js');
var Template = require('../../../lib/temperor.js');

function start() {

  new Template('Resp1ColMax640').append();

  var TodoInput = new Template('todo-input');
  TodoInput.willRender(function(elem) {
    var todoInput = $('input', elem);
    todoInput.on('change', function(e) {
      todo.append({todo: todoInput.value});
      var allTodos = [];
      for(var i = 0; i< todo.clones.length; i++) {
        allTodos.push(JSON.stringify(todo.getData(i)));
      }
      todoInput.value = '';
    });
  });

  var todo = new Template('todo');
  todo.willRender(function(elem) {
    $('.delete', elem).on('click', function(e) {
      todo.remove(elem);
    });

    $('.todo-text',elem).on('dblclick', function(e){
      $.forEach('.todo-main',elem,function(el){el.classList.add('hidden');});
      $('.edit-todo',elem).classList.add('editing');
      $('.edit-todo',elem).focus();
      $('.edit-todo',elem).value = $('.todo-text',elem).textContent;
      $('.edit-todo',elem).on('keypress', function(e){
        if (e.which === 13)
        updateTodo();
      });
      $('.edit-todo',elem).on('blur', function(e){
        updateTodo();
      });

      function updateTodo () {
        $.forEach('.todo-main',elem,function(el){el.classList.remove('hidden');});
        $('.todo-text',elem).textContent = $('.edit-todo',elem).value;
        $('.edit-todo',elem).classList.remove('editing');
      }

    });
  });

  TodoInput.append();
}


$.ready(start);
