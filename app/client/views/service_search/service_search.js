/* globals Template Session StatusMap Meteor _ $*/

function escapeRegex (text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

Template.serviceSearch.rendered = function () {
  $('#host-textarea').height($('#host-textarea')[0].scrollHeight)
}

Template.serviceSearch.events({
  'submit form': function (event, tpl) {
    event.preventDefault()
    var port = parseInt(tpl.find('[name=port]').value, 10)
    var protocol = escapeRegex(tpl.find('[name=protocol]').value)
    var service = escapeRegex(tpl.find('[name=service]').value)
    var product = escapeRegex(tpl.find('[name=product]').value)
    var query = {}
    if (port && !isNaN(port)) {
      query.port = port
    }
    if (protocol) {
      query.protocol = {
        $regex: protocol,
        $options: 'i'
      }
    }
    if (service) {
      query.service = {
        $regex: service,
        $options: 'i'
      }
    }
    if (product) {
      query.product = {
        $regex: product,
        $options: 'i'
      }
    }
    if (_.isEmpty(query)) {
      return
    }
    return Session.set('servicesViewQuery', query)
  },

  'click .port-row': function (event, tpl) {
    var port = parseInt(this.port, 10)
    var protocol = this.protocol
    var service = this.service
    var product = this.product
    var query = {
      port: port,
      protocol: protocol,
      service: service,
      product: product
    }
    tpl.find('[name=port]').value = port
    tpl.find('[name=protocol]').value = protocol
    tpl.find('[name=service]').value = service
    tpl.find('[name=product]').value = product
    return Session.set('servicesViewQuery', query)
  },

  'click #services-clear': function (event, tpl) {
    tpl.find('[name=port]').value = ''
    tpl.find('[name=protocol]').value = ''
    tpl.find('[name=service]').value = ''
    tpl.find('[name=product]').value = ''
    return Session.set('servicesViewQuery', null)
  },

  'click .service-status': function () {
    var status = StatusMap[StatusMap.indexOf(this.status) + 1]
    if (StatusMap.indexOf(this.status) + 1 > 4) {
      status = StatusMap[0]
    }
    return Meteor.call('setServiceStatus', this.projectId, this._id, status)
  },

  'click .flag-enabled': function () {
    return Meteor.call('disableServiceFlag', this.projectId, this._id)
  },

  'click .flag-disabled': function () {
    return Meteor.call('enableServiceFlag', this.projectId, this._id)
  }
})
