"use strict"

function Validator(onSubmit) {
    this.onSubmit = onSubmit

    const forms = document.querySelectorAll('.validate')
    for (let i = 0; i < forms.length; i++) {
      forms[i].setAttribute('novalidate', true)
    }

    const hasError = function (field) {
      if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return
  
      const validity = field.validity
      if (validity.valid) return
      if (validity.valueMissing) return 'Wypełnij to pole.'
      if (validity.typeMismatch) {
        if (field.type === 'email') return 'Proszę podać adres email.'
        if (field.type === 'url') return 'Proszę podać adres URL.'
      }
      if (validity.tooShort) return 'Proszę wydłużyć ten tekst do ' + field.getAttribute('minLength') + ' znaków lub więcej. Aktualnie używasz ' + field.value.length + ' znaków.'
      if (validity.tooLong) return 'Skróć ten tekst do najwyżej ' + field.getAttribute('maxLength') + ' znaków. Aktualnie używasz ' + field.value.length + ' znaków.'
      if (validity.badInput) return 'Proszę wpisać liczbę.'
      if (validity.stepMismatch) return 'Proszę wpisać prawidłową wartość.'
      if (validity.rangeOverflow) return 'Wybierz wartość, która nie jest większa niż ' + field.getAttribute('max') + '.'
      if (validity.rangeUnderflow) return 'Wybierz wartość nie mniejszą niż ' + field.getAttribute('min') + '.'
      if (validity.patternMismatch) return field.hasAttribute('title') ? field.getAttribute('title') :  'Proszę dopasować żądany format.'
      return 'Wartość wprowadzona dla tego pola jest nieprawidłowa.'
    }

    const showError = function (field, error) {
      field.classList.add('error')
      const id = field.id || field.name
      if (!id) return
      let message = field.form.querySelector('.error-message#error-for-' + id)
      if (!message) {
        message = document.createElement('div')
        message.className = 'error-message'
        message.id = 'error-for-' + id
        field.parentNode.insertBefore(message, field.nextSibling)
      }
      field.setAttribute('aria-describedby', 'error-for-' + id)
      message.innerHTML = error
      message.style.display = 'block'
      message.style.visibility = 'visible'
    }

    const removeError = function (field) {
      field.classList.remove('error')
      field.removeAttribute('aria-describedby')
      const id = field.id || field.name
      if (!id) return
      const message = field.form.querySelector('.error-message#error-for-' + id)
      if (!message) return
      message.innerHTML = ''
      message.style.display = 'none'
      message.style.visibility = 'hidden'
    }

    document.addEventListener('blur', function (event) {
      if (event.target.form && !event.target.form.classList.contains('validate')) return
      const error = hasError(event.target)
      if (error) 
        showError(event.target, error)
      else
        removeError(event.target)
    }, true)

    document.addEventListener('submit', function(event) {
      const submitButton = event.target.querySelector('button[type="submit"]')
      if (!event.target.classList.contains('validate') || submitButton.classList.contains('disabled')) return
      const fields = event.target.elements

      let error, hasErrors
      for (let i = 0; i < fields.length; i++) {
        error = hasError(fields[i])
        if (error) {
          showError(fields[i], error)
          if (!hasErrors) {
            hasErrors = fields[i]
          }
        }
      }

      if (hasErrors) {
        event.preventDefault()
        hasErrors.focus()
        return
      }

      onSubmit(event, submitButton)
    }, false)
}
