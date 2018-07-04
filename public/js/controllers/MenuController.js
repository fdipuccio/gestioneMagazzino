angular.module("gestionaleApp")
.controller("MenuController", ['$scope','$uibModal','PromemoriaService','UserService','AziendaService','$rootScope','LoginService','$sessionStorage','$location',
 function ($scope,$uibModal,PromemoriaService,UserService,AziendaService,$rootScope,LoginService,$sessionStorage,$location) {
	 'use strict';

	$scope.transient = {};
	$scope.transient.newPromemoria = {};
	$scope.transient.newPromemoria.nota = {};
	 
	 $scope.redirectToPage = function(url){
		
		if(url!=='#'){
			$( ".responsive-toggler" ).trigger( "click" );
		}
		
		if(url!=='logout'){
		 $location.url(url);
	 	}else{
	 		//logout
	 		LoginService.logout().then(function(response) { 
		    	if(response!== null && response.data !== null && response.data ==='LOGOUT' ){
		    		delete $sessionStorage.user;
					delete $scope.user;
					delete $sessionStorage.listaIvaApplicata;
					delete $scope.listaIvaApplicata;
					delete $sessionStorage.listaContiAzienda;
					delete $sessionStorage.listaPagamentoFatture;
					delete $scope.listaPagamentoFatture;
					delete $sessionStorage.listaValute;
					delete $sessionStorage.listaUDM;
					delete $sessionStorage.userMenu;
					delete $sessionStorage.tipoFattureList;
					delete $sessionStorage.azienda;

					$("#menuTop").hide();
					$("#menuSide").hide();
					$("#navLatr").hide();
			 		$location.url("/");
		    	}else{
		    		$scope.isInError=true;
		    		console.log('Errore logout');
		    	}
		    });
		}
	 }

	if($sessionStorage.user !== undefined){
		$scope.user = $sessionStorage.user;	
		$scope.userMenu = $sessionStorage.userMenu;
		$("#menuTop").show();
		$("#menuSide").show();
		$("#navLatr").show();
	}else{
		$("#menuTop").hide();
		$("#menuSide").hide();
		$("#navLatr").hide();
	}

	if($sessionStorage.azienda !== undefined){
		$scope.datiazienda = $sessionStorage.azienda;
	}
	

	 $scope.manageButton = function(obj){
	 	jQuery.each( $scope.userMenu.menuItems, function(item ) {
			 if(item !== obj.$index){
				$("#currentitem" + item).parent().removeClass("start active open");
			 }
		});

		if(!$("#currentitem" + obj.$index).parent().hasClass("start active open")){
			$("#currentitem" + obj.$index).parent().addClass("start active open");	
		}else{
			$("#currentitem" + obj.$index).parent().removeClass("start active open");
		}
	 }


	 $scope.$watch(function () { return $sessionStorage.user; },function(newVal,oldVal){
	   if(newVal){
	     $scope.user = $sessionStorage.user;
	     $scope.userMenu = $sessionStorage.userMenu;
	     if($scope.user !== undefined){
		    $("#menuTop").show();
			$("#menuSide").show();
		}else{
			$("#menuTop").hide();
			$("#menuSide").hide();
		}
	  }
	});

	$scope.$watch(function () { return $sessionStorage.azienda; },function(newVal,oldVal){
		if(newVal){
			$scope.datiazienda = $sessionStorage.azienda;
	    }
	 });

	 $scope.navManage = function (){

	 	if ($('#navLatr').hasClass('nav-is-visible') === true){
	 		$('#navLatr').removeClass('nav-is-visible');
	 	}else{
	 		$('#navLatr').addClass('nav-is-visible');
	 	}
	 }

	 $scope.gotoNuovaFattura = function(){
		$scope.navManage();
		$location.url('/fatture/inserisciFattura/IMME');
	 }

	 $scope.openModalNewPromemoria = function () {
	 	$scope.navManage();
	 	$scope.getUserList();
		$scope.transient.newPromemoria = {};
		$uibModal.open({
		templateUrl: './html/promemoria/modalNewPromemoria.html',
		scope:$scope,
		backdrop:'static',
		size: 'md',	
		controller: function ($scope, $uibModalInstance) {
			$scope.createNewPromemoriaButton = function () {
				createNewPromemoria($uibModalInstance);
			};		
			$scope.cancelNewPromemoriaButton = function () {
				//$uibModalInstance.close(false);
				$uibModalInstance.dismiss('cancel');
			};
		}
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };

 	 //private functions
	function createNewPromemoria($uibModalInstance){
		console.log("createNewPromemoria");
		//converto data
		$scope.transient.newPromemoria.nota.utenteFrom = $scope.user.ID;
		$scope.transient.newPromemoria.nota.expirationDate = $scope.formatDate($scope.transient.newPromemoria.nota.expirationDate);
		//adding default values
		PromemoriaService.createPromemoria($scope.transient.newPromemoria, $scope.user.ID).then(function(response) {  
	    	if(response!=null && response.data != null && response.data.status =='OK'){
	    		$scope.getPromemoriaList();
				toastr.success("Promemoria creato"); 
				$uibModalInstance.dismiss('cancel');
	    	} else {
				toastr.error("errore creazione Promemoria");				
			}    	
		});
	}

	$scope.formatDate = function(data){
		//var date = new Date(data);
		return data;
	}

	//funzione che recupera la lista degli eventi
    $scope.getPromemoriaList = function (){
        //invocazione service recupero promemoriaList
        PromemoriaService.getPromemoriaList($scope.user.ID).then(function(response) {

            var handleResponseResult = $scope.handleResponse(response);  
            if(handleResponseResult.next){              
            	$rootScope.promemoriaList = [];
                angular.forEach(response.data.note, function(item){
                    if(tempoRimasto(item.EXPIRATION_DATE).giorni >= 0){
                        var nota = {};
                        var dd = tempoRimasto(item.EXPIRATION_DATE).giorni;
                        var hh = tempoRimasto(item.EXPIRATION_DATE).ore;
                        var mm = tempoRimasto(item.EXPIRATION_DATE).minuti;
                        nota.nota = item.NOTA;
                        
                        if(dd == 0){
                          nota.icon = 'fa fa-bolt';
                          nota.label = 'label-danger';
                        }else if(dd > 0 && dd <=2){
                          nota.icon = 'fa fa-bell-o';
                          nota.label = 'label-warning';
                        }else if(dd > 2 && dd <=4){
                          nota.icon = 'fa fa-bullhorn';
                          nota.label = 'label-success';
                        }else if(dd > 4 && dd <=6){
                          nota.icon = 'fa fa-bullhorn';
                          nota.label = 'label-info';
                        }else{
                          nota.icon = 'fa fa-bell-o';
                          nota.label = 'label-default';
                        }

                        nota.deadline = dd>0?(dd>1?dd + ' giorni ':dd + ' giorno '):'' + hh>0?(hh>1?hh + ' ore ':hh + ' ora '):'' + mm>0?mm + ' min ':'scaduto ' + mm.replace("-", "") + ' min fa';
                        $rootScope.promemoriaList.push(nota);
                    }
                });
          
            } else {
                toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
            }     
        });
    }

	$scope.getUserList = function (){
		//invocazione service
		UserService.getUserList().then(function(response) {  
	    	if(response!=null && response.data != null){
	    		$scope.usersList = response.data;	    		
	    	}    	
	    });		
	}

	function tempoRimasto(tempo){
      let t = Date.parse(tempo) - Date.parse(new Date());
      let sec = Math.floor( (t/1000) % 60 );
      let min = Math.floor( (t/1000/60) % 60 );
      let ore = Math.floor( (t/(1000*60*60)) % 24 );
      let giorni = Math.floor( t/(1000*60*60*24) );
      
      return {
        'totale': t,
        'giorni': giorni,
        'ore': ore,
        'minuti': min,
        'secondi': sec
      };
    }

	//INIT PAGE

}]);
