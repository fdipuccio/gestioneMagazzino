angular.module("gestionaleApp").filter('flagToSiNo', function () {
    return function(flag) {
        if(flag == 1 || flag == true){
            return "SI";
        } else if(flag == 0 || flag == false){
            return "NO";
        } else {
            return flag;
        }
    }
}); 