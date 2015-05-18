(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $ = require('./tinix.js');

if ($.supported && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach
}

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

Template.prototype.remove = function(elem) {
  elem.parentNode.removeChild(elem)
  this.clones.splice(this.clones.indexOf(elem),1)
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

function tinix(selector, elem) {
    elem = elem || document
    return elem.querySelector(selector)
}

tinix.version = "0.2.0"

tinix.supported = !!document.addEventListener

if (tinix.supported && !Element.prototype.on) {
  Element.prototype.on = Element.prototype.addEventListener
}

tinix.all = function(selector, elem) {
    elem = elem || document
    return elem.querySelectorAll(selector)
}

tinix.forEach = function(selector, func) {
    Array.prototype.forEach.call(this.all(selector), func)
}

tinix.map = function(selector, func) {
    return Array.prototype.map.call(this.all(selector), func)
}

tinix.style = function(selector, iteratee, val) {
    this.forEach(s, function(elem) {
       elem.style[iteratee] = val
    })
}

tinix.display = function(selector, val) {
    this.style(selector, "display", val)
}

tinix.ready = function(func) {
  document.addEventListener('DOMContentLoaded', function() {func()})
}

tinix.isString = function(str) {
  return typeof(str) === 'string'
}

tinix.isArray = Array.isArray

tinix.isObject = function(str) {
  return Object.prototype.toString.call(str) === '[object Object]'
}

tinix.getR = function(callback) {
    var request = new XMLHttpRequest()
    responseText.onload = function() {
        if (request.status == 200) {
            if (request.getResponseHeader("Content-Type") == "application/json") {
                callback(null, JSON.parse(request.responseText))
            } else {
                callback(null, request.responseText)
            }
        } else {
            callback(request)
        }
    }
    return request
}


// get(url, callback [,overrideMimeType])
tinix.get = function(url, callback, overrideMimeType) {
    var request = this.getR(callback)
    request.open("GET", url)
    if (overrideMimeType) {
      request.overrideMimeType(overrideMimeType)
    }
    request.send()
}

// post(url, body, contenttype, callback)
tinix.post = function(url, body, contenttype, callback) {
    var request = this.getR(contenttype)
    request.open("POST", url)
    request.setRequestHeader("Content-Type", contenttype)
    request.send(body)
}

// postJSON(url, body, callback)
tinix.postJSON = function(url, body, callback) {
    this.post(url, JSON.stringify(body), "application/json", callback)
}


module.exports = tinix

},{}],3:[function(require,module,exports){
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

},{"../../../lib/temperor.js":1,"../../../lib/tinix.js":2}]},{},[3]);
