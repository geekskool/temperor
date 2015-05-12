var $ = require('../../../lib/tinix.js');
var Template = require('../../../lib/temperor.js');

function start() {

  new Template('Resp1ColMax640').append();

  var emailTemplate = new Template('email');

  emailTemplate.willRender(function(elem) {
    var emailinput = $('input', elem);
    emailinput.on('change', function(e) {
      newTodo({todo: emailinput.value});
      emailinput.value = '';
    });
  });

  function newTodo(data) {
    var todoTemplate = new Template('todo');
    todoTemplate.willRender(function(elem){
      $('button', elem).on('click', function(e){
        elem.parentNode.removeChild(elem);
      });

    });
    todoTemplate.append(data);
  }

  emailTemplate.append();
}

$.ready(start);
