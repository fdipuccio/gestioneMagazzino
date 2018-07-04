angular.module("gestionaleApp")
.controller("LoginController", ['$scope','$rootScope','LoginService','AziendaService','$location','$sessionStorage', function ($scope,$rootScope,LoginService,AziendaService,$location, $sessionStorage) {
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
		//invocazione service
	
		LoginService.checkLogin($scope.username, $scope.password).then(function(response) { 
	    	if(response!== null && response.data !== null && response.data !=='' ){
	    		if (response.data.FORCE_CHANGE_PWD === 1) {
					$location.url('/reset');
				} else {

					AziendaService.getDatiAzienda().then(function(response) {  
						var handleResponseResult = $scope.handleResponse(response);  
						if(handleResponseResult.next){
							$sessionStorage.azienda = response.data.azienda;
							if(response.data.azienda.LOGO_CONTENT_TYPE){
								$sessionStorage.azienda.urlImage = "data:"+response.data.azienda.LOGO_CONTENT_TYPE+";base64,"+response.data.azienda.LOGO;
							}else{
								$sessionStorage.azienda.urlImage = "";
							}
							$scope.datiazienda = $sessionStorage.azienda;	
						} else {
							toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
						}
					});	

					//Fare check Azienda

					AziendaService.esisteAzienda().then(function(responseAz) { 
						if(responseAz!== null && responseAz.data !== null && responseAz.data !=='' ){
							$( ".page-content").css( "margin-left", "235px" );
							$( ".page-container").css("margin-top", "75px").css("padding", "20px 20px 0");
							$("#menuTop").show();
							$("#menuSide").show();
							$("#navLatr").show();
							$sessionStorage.userMenu = angular.fromJson(response.data.MENU);
							$sessionStorage.user = response.data;
							$scope.user = $sessionStorage.user;	
							$scope.userMenu = $sessionStorage.userMenu;
							$location.url('/home');
						}else{
							$scope.isInError=true;
							console.log('Si è verificato un errore, si prega di contattare l\'amministratore');
							$scope.erroreLogin = 'Si è verificato un errore, si prega di contattare l\'amministratore';
						}
					});

				}

	    	}else{
	    		$scope.isInError=true;
				console.log('Errore login - credenziali errate ');
				$scope.erroreLogin = 'Errore login - credenziali errate';
	    	}
	    });	
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

