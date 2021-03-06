var $ = require('tinix')

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
        while (children[0]) {
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

Template.prototype.append = function(data, to) {

    var clone = document.importNode(this.template.content, true)
    if (data) {
        Object.keys(data).forEach(function(key) {
            var dataField = $('[data-field=' + key + ']', clone)
            if (dataField.type === 'checkbox') {
                dataField.checked = data[key]
            } else if (dataField) {
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
    to = to || this.template.parentElement
    var firstChild = clone.firstChild
    to.appendChild(firstChild)
    this.clones.push(firstChild)
    return firstChild
}

Template.prototype.remove = function(elem) {
    elem.parentNode.removeChild(elem)
    this.clones.splice(this.clones.indexOf(elem), 1)
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
        if (dataField.type && dataField.type === 'checkbox') {
            value = dataField.checked
        } else if (dataField.tagName === 'INPUT' || dataField.tagName == 'TEXTAREA') {
            value = dataField.value
        } else {
            value = dataField.textContent
        }
        data[key] = value
    })
    return data
}

Template.prototype.getDataAll = function() {
    return this.clones.map(function(item, i) {
        return this.getData(i)
    }.bind(this))
}

module.exports = Template
