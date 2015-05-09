(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $ = require('./tinix.js');
$.supported = !!document.addEventListener

function Template(name) {

  this.name = name
  this.template = $('template[data-name=' + name + ']')
  if (!this.template) throw 'Invalid Template Name'
  this.clones = []
  this.isLoading = false

  // For Unsupported Browsers
  if (!this.template.content) {
    var tContent = document.createDocumentFragment(),
        children = this.template.childNodes
    while(children[0]) {
      tContent.appendChild(children[0])
    }
    this.template.content = tContent
  }

  // remove whitespace nodes
  this.template.content.childNodes.forEach(function(child) {
    if (child.nodeName == '#text') {
      this.template.content.removeChild(child)
    }
  }.bind(this))

  if (this.template.content.childNodes.length !== 1) {
    throw 'Invalid template ' + this.name
  }

}

/*
 * Clone template and append to template parent.
 * if data Object provided will replace data textContent fields in template with
 * corresponding data Object Keys.
 * if data value has '<' innerHTML is replaced.
*/

Template.prototype.append = function(data) {

  var clone = document.importNode(this.template.content, true)
  if (data) {
    Object.keys(data).forEach(function(key) {
      var dataField = $('[data-field=' + key + ']', clone)
      if (dataField) {
        var value = data[key]
        if ($.isString(value) && value.match(/</)) {
          dataField.innerHTML = value
        } else {
          dataField.textContent = value
        }
      }
    })
  }
  if (this.willRenderCallback) {
    this.willRenderCallback(clone.firstChild)
  }
  this.clones.push(this.template.parentElement.appendChild(clone.firstChild))

}

/*
 * If callback will call callback with error and responseBody or
 * json object if Json response. error is called with response object
*/

Template.prototype.post = function(url, body, callback) {
  if (callback) {
    callback = callback.bind(this)
  }
  var localCallback = function(error, res) {
    this.isLoading = false
    if (callback) {
      callback(error, res)
    } else {
      this.append(res)
    }
  }.bind(this)
  if (!this.isLoading) {
    this.isLoading = true
    if ($.isObject(body) || $.isArray(body)) {
      $.postJSON(url, body, localCallback)
    } else {
      $.post(url, body, 'application/x-www-form-urlencoded', localCallback)
    }
  }
}

Template.prototype.willRender = function(callback) {
  this.willRenderCallback = callback
}

Template.prototype.getData = function(index) {
  index = index || 0
  var dataFields = $.all('[data-field]', this.clones[index])
  var data = {}
  dataFields.forEach(function(dataField) {
    var key = dataField.getAttribute('data-field'),
        value
    if (dataField.tagName === 'INPUT' || dataField.tagName == 'TEXTAREA') {
      value = dataField.value
    } else {
      value = dataField.textContent
    }
    data[key] = value
  })
  return data
}

module.exports = Template

},{"./tinix.js":2}],2:[function(require,module,exports){
// tinix.js
//
// Copyright 2013 - Santosh Rajan - santoshrajan.com
//

if (!Element.prototype.on) Element.prototype.on = Element.prototype.addEventListener

var tinix = function(id) {
    return document.querySelector(id)
}

tinix.version = "0.0.15"

tinix.all = function(id) {
    return document.querySelectorAll(id)
}

tinix.forEach = function(s, f) {
    Array.prototype.forEach.call(this.all(s), f)
}

tinix.map = function(s, f) {
    return Array.prototype.map.call(this.all(s), f)
}

tinix.style = function(s, n, v) {
    this.forEach(s, function(elem) {
       elem.style[n] = v
    })
}

tinix.display = function(s, v) {
    this.style(s, "display", v)
}

tinix.ready = function(f) {
    if (document.readyState == "loading") {
        document.onreadystatechange = function() {
            if (document.readyState == "interactive") f()
        }
    } else {
        f()
    }
}

tinix.getR = function(c) {
    var r = new XMLHttpRequest()
    r.onload = function() {
        if (r.status == 200) {
            if (r.getResponseHeader("Content-Type") == "application/json") {
                c(null, JSON.parse(r.responseText))
            } else {
                c(null, r.responseText)
            }
        } else {
            c(r)
        }
    }
    return r
}

// get(url, callback [,overrideMimeType])
tinix.get = function(u, c, o) {
    var r = this.getR(c)
    r.open("GET", u)
    if (o) {
      r.overrideMimeType(o)
    }
    r.send()
}

// post(url, body, contenttype, callback)
tinix.post = function(u, b, t, c) {
    var r = this.getR(c)
    r.open("POST", u)
    r.setRequestHeader("Content-Type", t)
    r.send(b)
}

// postJSON(url, body, callback)
tinix.postJSON = function(u, b, c) {
    this.post(u, JSON.stringify(b), "application/json", c)
}


module.exports = tinix

},{}],3:[function(require,module,exports){
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

},{"../../../lib/temperor.js":1,"../../../lib/tinix.js":2}]},{},[3]);
