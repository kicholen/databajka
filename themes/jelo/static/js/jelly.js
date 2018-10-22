(function($) {
    var cacheMap = {};
    var current;

    "use strict";

      function validate(object, isCorrect) {
        if (isCorrect)
          object.parent().removeClass("has-error").addClass("valid");
        else
          object.parent().removeClass("valid").addClass("has-error");
      }

      $('#contact-fullname').on('input', function() {
        validate($(this), true);
      });

      $('#contact-email').on('input', function() {
        validate($(this), true);
      });

      $('#contact-product').on('change', function() {
        validate($(this), true);
      });

      $('#contact-phone').on('input', function() {
        validate($(this), true);
      });

      $('#datetimepicker_to').on('dp.change', function() {
        validate($(this), true);
      });

      $('#contact-form').on('submit', function(e) {
        e.preventDefault();

        // validate 
        var isFullNameValid = $('#contact-fullname').val();
        validate($('#contact-fullname'), isFullNameValid);

        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var isEmailValid = emailRegex.test($('#contact-email').val());
        validate($('#contact-email'), isEmailValid);

        var isProductValid = $('#contact-product').val() !== "Wybierz produkt";
        validate($('#contact-product'), isProductValid);

        validate($('#contact-phone'), $('#contact-phone').val());

        var isFromDateValid = $('#datetimepicker_from').data("DateTimePicker").date();
        validate($('#datetimepicker_from'), isFromDateValid);

        var isToDateValid = $('#datetimepicker_to').data("DateTimePicker").date();
        validate($('#datetimepicker_to'), isToDateValid);

        if (!isFullNameValid || !isEmailValid || !isProductValid || !isFromDateValid || !isToDateValid)
          return;

        var submitText = $('#submit').text();
        $('#submit').addClass("disabled");
        $('#submit').text("Wysyłam");

        var dataToSend = "Imię i nazwisko: " + isFullNameValid + '\n'
          + "Email: " + $('#contact-email').val()  + '\n'
          + "Product: " + $('#contact-product').val()  + '\n'
          + "Telefon: " + $('#contact-phone').val()  + '\n'
          + "Data od: " + isFromDateValid.format("MM/DD/YYYY") + " do: " + isToDateValid.format("MM/DD/YYYY") + '\n'
          + "Ilość sztuk: " + $('#contact-count').val()  + '\n'
          + "Tekst: " + $('#contact-question').val();

        // send 
        $.ajax({
            type: "POST",
            url: "/.netlify/functions/sendMail",
            data: dataToSend,
            success: function(data, text, xhr) {
              var alertBox = '<div id="jelly-alert" class="alert alert-success alert-dismissable alert-fixed"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Wysłano!</div>';
              $('#messages').html(alertBox);
              $("#jelly-alert").delay(3000).slideUp(200, function() {
                $(this).alert('close');
              });
              $('#contact-form')[0].reset();
              $('#submit').removeClass("disabled");
              $('#submit').text(submitText);
              fbq('track', 'Lead');
            },
            error: function(data, text, error) {
              var alertBox = '<div id="jelly-alert" class="alert alert-warning alert-dismissable alert-fixed"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Oops, wystąpił błąd, przepraszamy.</div>';
              $('#messages').html(alertBox);
              $('#submit').removeClass("disabled");
              $('#submit').text(submitText);
              $("#jelly-alert").delay(3000).slideUp(200, function() {
                $(this).alert('close');
              });
            }
        });
        return false;
      });
})(jQuery);
