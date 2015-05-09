var $ = require('../../../lib/tinix.js');
var Template = require('../../../lib/temperor.js');

function start() {

  new Template('Resp1ColMax640').append()

  var emailTemplate = new Template('email')

  emailTemplate.willRender(function(elem) {

      var emailinput = $('input', elem)

    /*  emailinput.on('change', function(e) {
        var email = emailinput.value
        if (email.length > 3 && /^[\w\.-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
          emailinput.disabled = true
          $.postJSON("/apply", {email: email}, function(err, res) {
            if (err) {
              alert("Connection Error")
              emailinput.disabled = false
            } else {
              if (res.error) {
                alert(res.message)
                emailinput.disabled = false
              } else {
                elem.style.display = 'none'
                codeTemplate.append()
              }
            }
          })

        } else {
          alert("Invalid Email Address")
        }
        e.preventDefault()
      })*/

  })

  var codeTemplate = new Template('code')

  codeTemplate.willRender(function(elem) {

      var codeinput = $('input', elem)
      codeinput.on('change', function(e) {
        var code = e.target.value
        if (code.length === 6 && /^\d{6}$/.test(code)) {
          codeinput.disabled = true
          $.postJSON("/apply", {code: code}, function(err, res) {
            if (err) {
              alert("Connection Error")
              codeinput.disabled = false
            } else {
              if (res.error) {
                alert(res.message)
                codeinput.disabled = false
              } else {
                elem.style.display = 'none'
                infoTemplate.append({info: res.email})
                applicationTemplate.append()
              }
            }
          })

        } else {
          alert("Invalid Code")
        }
        e.preventDefault()
      })

  })

  var infoTemplate = new Template('info')

  var applicationTemplate = new Template('application')

  applicationTemplate.willRender(function(elem) {

      var button = $('button', elem)
      button.on('click', function(e) {

        var data = this.getData()
        var emptyFields = false
        Object.keys(data).forEach(function(key) {
          if (data[key].trim().length == 0) emptyFields = true
        })

        if (emptyFields) {
          alert("All Fields are mandatory")
        } else {

          button.disabled = true
          $.postJSON("/apply", data, function(err, res) {
            if (err) {
              alert("Connection Error")
              button.disabled = false
            } else {
              if (res.error) {
                alert(res.message)
                button.disabled = false
              } else {
                elem.style.display = 'none'
                infoTemplate.append({
                  info: 'Thank you for your application. You will hear from us shortly.'
                })
              }
            }
          })

        }

        e.preventDefault()
      }.bind(this))

  })

  emailTemplate.append()
  new Template('test').append()
  new Template('test').append()
  new Template('test').append()

}

$.ready(start)
