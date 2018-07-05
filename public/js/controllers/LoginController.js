angular.module("gestionaleApp")
.controller("LoginController", ['$scope','$rootScope','LoginService','$location','$sessionStorage', function ($scope,$rootScope,LoginService,$location, $sessionStorage) {
	 console.log("entro");
	 $scope.isInError=false;
	 $scope.erroreLogin;

	 if($sessionStorage.user !==undefined){
	 	$( ".page-content").css( "margin-left", "235px" );
		$( ".page-container").css("margin-top", "75px").css("padding", "20px 20px 0");
	 	$location.url('/home');
	 }else{
	 	$( "div.user-login-5").parent().css( "margin-left", "0px" );
		$( "div.user-login-5").parent().parent().parent().css("margin-top", "0px").css("padding", "0");
	 }

	//funzione che effettua la login
	$scope.login = function (){

		$( ".page-content").css( "margin-left", "235px" );
		$( ".page-container").css("margin-top", "75px").css("padding", "20px 20px 0");
		$("#menuTop").show();
		$("#menuSide").show();
		$("#navLatr").show();
		$sessionStorage.userMenu = {}; //angular.fromJson(response.data.MENU);
		$sessionStorage.user = {}//response.data;
		$scope.user = $sessionStorage.user;	
		$scope.userMenu = $sessionStorage.userMenu;
		$location.url('/home');

		//TODO effettuare login

		//invocazione service
		/*
		LoginService.checkLogin($scope.username, $scope.password).then(function(response) { 
	    	if(response!== null && response.data !== null && response.data !=='' ){
	    		if (response.data.FORCE_CHANGE_PWD === 1) {
					$location.url('/reset');
				} else {

					

				}

	    	}else{
	    		$scope.isInError=true;
				console.log('Errore login - credenziali errate ');
				$scope.erroreLogin = 'Errore login - credenziali errate';
	    	}
		});	
		*/
	}

	
    
    $scope.resetPwd = function (){
		//invocazione service
		LoginService.resetPassword($scope.username, $scope.oldpassword, $scope.newpassword).then(function(response) {  
	    	if(response!== null && response.data !== null && response.data !=='' ){
	    		$scope.password = $scope.newpassword;
	    		toastr.success("password cambiata");
	    		$scope.login();
	    	}else{
	    		toastr.error("Errore reset password");
	    	}
	    });
				
	}
  
	

}]);

