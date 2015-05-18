var $ = require('../../../lib/tinix.js');
var Template = require('../../../lib/temperor.js');

function start() {

  new Template('Resp1ColMax640').append();

  var emailTemplate = new Template('todo-input');
  emailTemplate.willRender(function(elem) {
    var todoinput = $('input', elem);
    todoinput.on('change', function(e) {
      todoTemplate.append({todo: todoinput.value});
      todoinput.value = '';
    });
  });

  var todoTemplate = new Template('todo');
  todoTemplate.willRender(function(elem) {
    $('button', elem).on('click', function(e) {
      todoTemplate.remove(elem);
    });
  });

  emailTemplate.append();
}

$.ready(start);
