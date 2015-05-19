var $ = require('../../../lib/tinix.js');
var Template = require('../../../lib/temperor.js');

function start() {

  function storeTodos () {
    var items = [];
    for(var i = 0; i< todo.clones.length; i++) {
      items.push(todo.getData(i));
    }
    localStorage.setItem('todos',JSON.stringify(items));
  }

  new Template('Resp1ColMax640').append();

  var TodoInput = new Template('todo-input');

  TodoInput.willRender(function(elem) {
    var todoInput = $('input', elem);
    todoInput.on('change', function(e) {
      todo.append({todo: todoInput.value});
      storeTodos();
      todoInput.value = '';
    });
  });

  var todo = new Template('todo');
  todo.willRender(function(elem) {
    $('.delete', elem).on('click', function(e) {
      todo.remove(elem);
      storeTodos();
    });

    $('.check', elem).on('click', function(e) {
      storeTodos();
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
        storeTodos();
        $('.edit-todo',elem).classList.remove('editing');
      }
    });
  });

  TodoInput.append();
  JSON.parse(localStorage.getItem('todos')).forEach(function(elem){
    todo.append(elem);});
}

$.ready(start);
