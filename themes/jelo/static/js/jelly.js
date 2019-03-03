(function($) {
    "use strict"

    const showAlert = (submitButton, alertType, infoText) => {
      $('#messages').html('<div id="jelly-alert" class="alert '
        + alertType
        + ' alert-dismissable alert-fixed"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
        + infoText    
        + '</div>')
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

    const showPosition = (position) => {
      $('#latitude').val(position.coords.latitude)
      $('#longtitude').val(position.coords.longitude)
    }
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(showPosition);

    const onSubmit = (event, submitButton) => {
      event.preventDefault()
      submitButton.classList.add("disabled")
      
      const settings = {
        type: "POST",
        contentType: "application/json",
        url: "https://salaryfunction20190303011415.azurewebsites.net/api/salary",
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
