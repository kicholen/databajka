(function($) {
    "use strict"

    const showAlert = (submitButton, alertType, infoText) => {
      var alertBox = '<div id="jelly-alert" class="alert '
        + alertType
        + ' alert-dismissable alert-fixed"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
        + infoText    
        + '</div>'
      $('#messages').html(alertBox)
      $("#jelly-alert").delay(3000).slideUp(200, function() {
        $(this).alert('close')
      })
      submitButton.classList.remove("disabled")
    }

    const formToJSON = elements => [].reduce.call(elements, (data, element) => {
      if (element.name && element.value) {
        data[element.name] = element.value
      }
      return data
    }, {})

    const onSubmit = (event, submitButton) => {
      event.preventDefault()
      submitButton.classList.add("disabled")
      
      const settings = {
        type: "POST",
        contentType: "application/json",
        url: "https://29fufz2qb0.execute-api.eu-west-1.amazonaws.com/Prod/api/salary",
        data: JSON.stringify(formToJSON(event.target.elements))
      }

      $.ajax(settings).then(response => {
        showAlert(submitButton, 'alert-success', 'Wysłano!')
        $(event.target)[0].reset()
      }).fail(error => {
        showAlert(submitButton, 'alert-warning', 'Oops, wystąpił błąd, przepraszamy.')
      })
    }
    new Validator(onSubmit)
})(jQuery)
