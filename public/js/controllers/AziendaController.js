angular.module("gestionaleApp")
.controller("AziendaController", ['$scope','$uibModal','CommonService','PromemoriaService','$rootScope','AziendaService','FatturatiService','FattureService','$sessionStorage','DTOptionsBuilder', 'DTColumnDefBuilder', 
function ($scope,$uibModal,CommonService,PromemoriaService,$rootScope,AziendaService,FatturatiService,FattureService,$sessionStorage,DTOptionsBuilder,DTColumnDefBuilder) {
   'use strict';
	console.log("begin gestione azienda");
    $scope.deleteLogo=false;

    $scope.dtOptions = DTOptionsBuilder.newOptions()	
	.withOption('responsive', true)
	.withOption('paging', false)
	.withOption('lengthChange', false)
	.withOption('bInfo', false)	
	.withOption('order', [])
	.withOption('bFilter', true)
	.withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs = [          
		DTColumnDefBuilder.newColumnDef(0).withOption('width', '35%'),
		DTColumnDefBuilder.newColumnDef(1).withOption('width', '20%'),		
		DTColumnDefBuilder.newColumnDef(2).withOption('width', '35%'),
		DTColumnDefBuilder.newColumnDef(3).notSortable().withOption('width', '10%')
	];

    //funzione che recupera la lista di tutti i dati azienda
	$scope.getDatiAzienda = function (flag){
		//invocazione service
		$scope.spinner.on();
		AziendaService.getDatiAzienda().then(function(response) {  
            $scope.deleteLogo = false;
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
                $scope.azienda = response.data.azienda;
                $scope.percentage = calcolaPerc();
                $scope.percentageClass = "p" + $scope.percentage;
                if(response.data.azienda.LOGO_CONTENT_TYPE){
                    $scope.azienda.urlImage = "data:"+response.data.azienda.LOGO_CONTENT_TYPE+";base64,"+response.data.azienda.LOGO;
                    if(!flag){
                        $("span.filename-edit").html("<i class='fa fa-file'></i>&nbsp;&nbsp;logoAzienda.jpg");
                    }
                }else{
                    $scope.azienda.urlImage = "";
                }
                //aggiorno l'oggetto in sessione
                $sessionStorage.azienda = $scope.azienda;
                $scope.$parent.$parent.$parent.$parent.datiazienda = $sessionStorage.azienda;
                $scope.readAccountsAzienda();
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();
	    });		
	}

    //Creazione Conto Azienda
    /*
    $scope.openModalAddContiAzienda = function () {
		$scope.transient.manageConto = {};
		$uibModal.open({
		templateUrl: './html/azienda/modalEditContiAzienda.html',
		scope:$scope,	
		backdrop:'static',
		size: 'md',	
		controller: function ($scope, $uibModalInstance) {
			$scope.createNewContoButton = function () {
				$scope.createNewConto($uibModalInstance);
			};		
			$scope.cancelContiAziendaButton = function () {
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
    */
	$scope.readAccountsAzienda = function (){
		//invocazione service
		AziendaService.getContiByAzienda($scope.azienda.IDAZIENDA).then(function(response) {  
	    	if(response!=null && response.data != null){
				$scope.accountsListAzienda = response.data.conti;
				$sessionStorage.listaContiAzienda = response.data.conti;
	    	}    	
	    });
	}

	$scope.createNewConto = function(){
		var vm = this;		
		AziendaService.salvaContoAzienda($scope.azienda.IDAZIENDA,$scope.transient.manageConto).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
                vm.newContoForm.$setPristine();
                toastr.success("Conto aggiunto con successo");	
				$scope.readAccountsAzienda();	
                $scope.transient.manageConto = {};				
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
    }
    
    $scope.updateConto = function(idConto){
		var vm = this;		
		AziendaService.AggiornaContoAzienda($scope.azienda.IDAZIENDA, idConto,$scope.transient.manageConto).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
                vm.newContoForm.$setPristine();
                toastr.success("Conto aggiornato con successo");	
				$scope.readAccountsAzienda();	
                $scope.transient.manageConto = {};				
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}

	//al momento non invocata perchè già in modale
	$scope.askConfirmationDeleteConto = function(p_id) {
    var message = "Sei sicuro di voler eliminare questo conto?";
    var modalHtml = '<div class="modal-body">' + message + '</div>';
    modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteContoAzienda()">OK</button><button class="btn btn-warning" ng-click="cancelDeleteConto()">Cancel</button></div>';

    $uibModal.open({
		template: modalHtml,
		scope:$scope,	
		backdrop:'static',	
		controller: function ($scope, $uibModalInstance) {
			$scope.confirmDeleteContoAzienda = function () {
				$scope.removeContoAzienda(p_id);
				$uibModalInstance.dismiss('cancel');
			};		
			$scope.cancelDeleteConto = function () {
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

	$scope.removeContoAzienda = function (p_id){
		console.log("removeContoAzienda = " + p_id);
		AziendaService.deleteContoAzienda(p_id).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
                $scope.readAccountsAzienda();
                toastr.success("Conto eliminato con successo");	
				$scope.transient.manageConto = {}; 						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}     	
	    });				
	}

    $scope.aggiornaDatiAzienda = function (){
        if(!$scope.deleteLogo && $scope.azienda.logo==undefined && $scope.azienda.LOGO!=undefined){
            $scope.deleteLogo=false;
            $scope.azienda.logo = {};
            $scope.azienda.logo.base64 = $scope.azienda.LOGO;
            $scope.azienda.logo.filetype = $scope.azienda.LOGO_CONTENT_TYPE;
        }
        AziendaService.aggiornaDatiAzienda($scope.azienda, $scope.azienda.IDAZIENDA).then(function(response) {  
			
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
                console.log("Azienda modificata"); 					
                $scope.getDatiAzienda('reload');
				toastr.success("Operazione eseguita con successo");					
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}		    
			
		
		});
    }

    $scope.loadStart = function (e, reader, file, fileList, fileOjects, fileObj) {
        //TODO gestire un loader e il success del file caricato
        console.log("starting upload");
        if(e.total > 3000000){
            reader.abort();
          toastr.error("Errore","L'allegato " + file.name + " eccede le dimensioni consentite di 3mb.");
        }else{
            toastr.success("Caricamento eseguito dell'allegato " + file.name);
        }
        
    };

    $scope.loadEnd = function (e, reader, file, fileList, fileOjects, fileObj) {
        
        $scope.azienda.urlImage = "data:"+fileObj.filetype+";base64,"+fileObj.base64;

        console.log("end");
    };


    $scope.errorHandler = function (event, reader, file, fileList, fileObjs, object) {
        console.log("An error occurred while reading file: "+file.name);
        reader.abort();
        toastr.error("Si è verificato un errore sul caricamento del file " + file.name);
    };

    $('.nav-tabs a').click(function (e) {
	    e.preventDefault();
	    $(this).tab('show');
	});

    $scope.eliminaPreview = function (){
        $scope.azienda.urlImage = "";
        $scope.deleteLogo=true;
    };

    //INIT PAGE
    $scope.getDatiAzienda(null);
      
    function calcolaPerc() {
        var count=0;
        var x;
        for (x in $scope.azienda) {
            if($scope.azienda[x]!=="" && $scope.azienda[x]!==undefined && $scope.azienda[x]!==null ){
                count+=1;
            }
        }
        return parseInt(count/Object.keys($scope.azienda).length*100);
    };

}]);

