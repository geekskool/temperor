var $ = require('../../../lib/tinix.js');
var Template = require('../../../lib/temperor.js');

function start() {

  new Template('Resp1ColMax640').append();

  var todoInput = new Template('todo-input');
  todoInput.willRender(function(elem) {
    var todoinput = $('input', elem);
    todoinput.on('change', function(e) {
      todo.append({todo: todoinput.value});
      todoinput.value = '';
    });
  });

  var todo = new Template('todo');
  todo.willRender(function(elem) {
    $('button', elem).on('click', function(e) {
      todo.remove(elem);
    });
  });

  todoInput.append();
}

$.ready(start);
