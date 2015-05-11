// tinix.js
//
// Copyright 2013 - Santosh Rajan - santoshrajan.com
//

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
    if (document.readyState == "loading") {
        document.onreadystatechange = function() {
            if (document.readyState == "interactive") func()
        }
    } else {
        func()
    }
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
