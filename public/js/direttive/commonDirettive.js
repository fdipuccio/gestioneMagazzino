angular.module("gestionaleApp").directive('allowOnlyNumbers', function () {  
    return {  
        restrict: 'A',  
        link: function (scope, elm, attrs, ctrl) {  
            elm.on('keydown', function (event) {  
                var $input = $(this);  
                var value = $input.val();  
                value = value.replace(/[^0-9]/g, '')  
                $input.val(value);  
                if (event.which == 64 || event.which == 16) {  
                    // to allow numbers  
                    return false;  
                } else if (event.which >= 48 && event.which <= 57) {  
                    // to allow numbers  
                    return true;  
                } else if (event.which >= 96 && event.which <= 105) {  
                    // to allow numpad number  
                    return true;  
                } else if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {  
                    // to allow backspace, enter, escape, arrows  
                    return true;  
                } else {  
                    event.preventDefault();  
                    // to stop others  
                    //alert("Sorry Only Numbers Allowed");  
                    return false;  
                }  
            });  
        }  
    }  
});  

angular.module("gestionaleApp").directive("bloccoMaxValue", function() {
  return {
    link: function(scope, element, attributes) {
      var oldVal = null;
      element.on("keydown keyup", function(e) {
    if (Number(element.val()) > Number(attributes.max) &&
          e.keyCode != 46 // delete
          &&
          e.keyCode != 8 // backspace
        ) {
          e.preventDefault();
          element.val(oldVal);
        } else {
          oldVal = Number(element.val());
        }
      });
    }
  };
});