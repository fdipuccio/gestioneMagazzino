angular.module("gestionaleApp")
.controller("PrimanotaController", ['$scope','$uibModal', '$location','$filter', 'PrimanotaService','AziendaService','ClienteService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, $location, $filter, PrimanotaService,AziendaService,ClienteService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};	
	$scope.primanotaList = [];
	$scope.accountsList = [];
	$scope.accountsListAzienda = [];
	$scope.customersList = [];
	
	$scope.filter = {};
	//default "Tutti i conti"
	$scope.filter.filtroConto = -1;
	$scope.descContoSelected = "Tutti i conti";
	$scope.transient = {};
	$scope.persistent = {};
	$scope.transient.newPrimanota = {};
	$scope.persistent.editPrimanota = {};

	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true)
	.withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs = [          
		DTColumnDefBuilder.newColumnDef(6).notSortable()
	];

	$scope.annoCorrente = new Date().getFullYear();
	$scope.meseCorrente = new Date().getMonth()+1;

	$scope.filt = {};
	
	$scope.datePickerOptions = {showWeeks: false}; 
	// START PUBLIC FUNCTIONS

	//funzione che recupera la lista prima nota
	$scope.getPrimanotaList = function (){
		//invocazione service
		PrimanotaService.getPrimanotaList().then(function(response) {  
	    	if(response!=null && response.data != null){
	    		$scope.primanotaList = response.data;	    		
	    	}    	
	    });		
	}
	
	//funzione che recupera la lista dei conti
	$scope.readAccounts = function (){
		//invocazione service
		PrimanotaService.readAccounts().then(function(response) {  
			if(response!=null && response.data != null){
				$scope.accountsList = response.data;	    		
			}    	
		});		
	}

	//effettua l'export in xls della prima nota
	$scope.exportPrimanota = function () {
		$scope.spinner.on();
		var a         = document.createElement('a');
		var urlTemp = $location.protocol()+":\/\/"+$location.host()+":"+$location.port();
		a.href        = urlTemp+"/primanota/export"; 
		a.target      = '_self';
		a.download    = "primanota.xlsx";
		document.body.appendChild(a);
		a.click();			
		console.log("export primanota effettuato correttamente");	
		toastr.success("Export effettuato con successo");		
	    	
			$scope.spinner.off();	
	   
		
	}

	//funzione che recupera la lista dei conti
	$scope.readAccountsAzienda = function (idAzienda){
		//invocazione service
		AziendaService.getContiByAzienda(idAzienda).then(function(response) {  
	    	if(response!=null && response.data != null){
	    		$scope.accountsListAzienda = response.data.conti;	    		
	    	}    	
	    });
	}
	
	$scope.getCustomersList = function (){
		//invocazione service
		ClienteService.getClientiList().then(function(response) {  
	    	if(response!=null && response.data != null){
				$scope.customersList = response.data.customers;	 
						
	    	}    	
	    });		
	}

	//funzione che recupera la lista prima nota
	$scope.getPrimanotaWithFilterList = function (filt, typeFilter, init){
		//Gestione filtri da completare
		switch(typeFilter) {
		    case "conto":
			  $scope.filter.filtroConto = filt;
			  $scope.valDescConto($scope.filter.filtroConto);
		      //$scope.resetButtonAccount('contoBtn' + filt);
		      break;
		    case "tuttocompetenza":
		      delete $scope.filter.filtroCompetenza;
		      //$scope.resetButton('tuttocompetenzaBtn', 'competenzaBtn', '');
		      break;
		    case "competenza":
		      filt?$scope.filter.filtroCompetenza:delete $scope.filter.filtroCompetenza;
		      //$scope.resetButton('competenzaBtn', 'tuttocompetenzaBtn', '');
		      break;
		    case "tutto":
		      delete $scope.filter.filtroEntrate;
		      delete $scope.filter.filtroUscite;
		      //$scope.resetButton('tuttoBtn', 'usciteBtn', 'entrateBtn');
		      break;
		    case "entrate":
		      filt?delete $scope.filter.filtroUscite:delete $scope.filter.filtroEntrate;
		      //$scope.resetButton('entrateBtn', 'tuttoBtn', 'usciteBtn');
		      break;
		    case "uscite":
		      filt?delete $scope.filter.filtroEntrate:delete $scope.filter.filtroUscite;
		      delete $scope.filter.filtroEntrate;
		      //$scope.resetButton('usciteBtn', 'tuttoBtn', 'entrateBtn');
		      break;
		    case "questomese":
		      $scope.filter.filtroQstMese = filt;
		      delete $scope.filter.filtroPrimoTrimestre;
		      delete $scope.filter.filtroSecondoTrimestre;
		      delete $scope.filter.filtroTerzoTrimestre;
		      delete $scope.filter.filtroQuartoTrimestre;
		      delete $scope.filter.filtroMesePrec;
		      delete $scope.filter.filtroDataCustomStart;
		      delete $scope.filter.filtroDataCustomEnd;
		      $scope.calcolaRangeDate($scope.annoCorrente, $scope.meseCorrente, $scope.meseCorrente);
		      $scope.resetMenu('questomeseBtn', 'mesescorsoBtn', 'primotrimestreBtn', 'secondotrimestreBtn', 'terzotrimestreBtn', 'quartotrimestreBtn', 'sceltadateBtn');
		      break;
		    case "meseprecedente":
		      $scope.filter.filtroMesePrec = filt;
		      delete $scope.filter.filtroPrimoTrimestre;
		      delete $scope.filter.filtroSecondoTrimestre;
		      delete $scope.filter.filtroTerzoTrimestre;
		      delete $scope.filter.filtroQuartoTrimestre;
		      delete $scope.filter.filtroQstMese;
		      delete $scope.filter.filtroDataCustomStart;
		      delete $scope.filter.filtroDataCustomEnd;
		      $scope.calcolaRangeDate($scope.meseCorrente==1?$scope.annoCorrente-1: $scope.annoCorrente, $scope.meseCorrente==1?12: $scope.meseCorrente-1, $scope.meseCorrente==1?12: $scope.meseCorrente-1);
		      $scope.resetMenu('mesescorsoBtn', 'questomeseBtn', 'primotrimestreBtn', 'secondotrimestreBtn', 'terzotrimestreBtn', 'quartotrimestreBtn', 'sceltadateBtn');
		      break;
		    case "primotrimestre":
		      $scope.filter.filtroPrimoTrimestre = filt;
		      delete $scope.filter.filtroQstMese;
		      delete $scope.filter.filtroSecondoTrimestre;
		      delete $scope.filter.filtroTerzoTrimestre;
		      delete $scope.filter.filtroQuartoTrimestre;
		      delete $scope.filter.filtroMesePrec;
		      delete $scope.filter.filtroDataCustomStart;
		      delete $scope.filter.filtroDataCustomEnd;
		      $scope.calcolaRangeDate($scope.annoCorrente, "01", "03");
		      $scope.resetMenu('primotrimestreBtn', 'mesescorsoBtn', 'questomeseBtn', 'secondotrimestreBtn', 'terzotrimestreBtn', 'quartotrimestreBtn', 'sceltadateBtn');
		      break;
		    case "secondotrimestre":
		      $scope.filter.filtroSecondoTrimestre = filt;
		      delete $scope.filter.filtroPrimoTrimestre;
		      delete $scope.filter.filtroQstMese;
		      delete $scope.filter.filtroTerzoTrimestre;
		      delete $scope.filter.filtroQuartoTrimestre;
		      delete $scope.filter.filtroMesePrec;
		      delete $scope.filter.filtroDataCustomStart;
		      delete $scope.filter.filtroDataCustomEnd;
		      $scope.calcolaRangeDate($scope.annoCorrente, "04", "06");
		      $scope.resetMenu('secondotrimestreBtn', 'mesescorsoBtn', 'primotrimestreBtn', 'questomeseBtn', 'terzotrimestreBtn', 'quartotrimestreBtn', 'sceltadateBtn');
		      break;
		    case "terzotrimestre":
		      $scope.filter.filtroTerzoTrimestre = filt;
		      delete $scope.filter.filtroPrimoTrimestre;
		      delete $scope.filter.filtroQstMese;
		      delete $scope.filter.filtroSecondoTrimestre;
		      delete $scope.filter.filtroQuartoTrimestre;
		      delete $scope.filter.filtroMesePrec;
		      delete $scope.filter.filtroDataCustomStart;
		      delete $scope.filter.filtroDataCustomEnd;
		      $scope.calcolaRangeDate($scope.annoCorrente, "07", "09");
		      $scope.resetMenu('terzotrimestreBtn', 'mesescorsoBtn', 'primotrimestreBtn', 'secondotrimestreBtn', 'questomeseBtn', 'quartotrimestreBtn','sceltadateBtn');
		      break;
		    case "quartotrimestre":
		      $scope.filter.filtroQuartoTrimestre = filt;
		      delete $scope.filter.filtroPrimoTrimestre;
		      delete $scope.filter.filtroSecondoTrimestre;
		      delete $scope.filter.filtroTerzoTrimestre;
		      delete $scope.filter.filtroMesePrec;
		      delete $scope.filter.filtroQstMese;
		      delete $scope.filter.filtroDataCustomStart;
		      delete $scope.filter.filtroDataCustomEnd;
		      $scope.calcolaRangeDate($scope.annoCorrente, "10", "12");
		      $scope.resetMenu('quartotrimestreBtn', 'mesescorsoBtn', 'primotrimestreBtn', 'secondotrimestreBtn', 'terzotrimestreBtn', 'questomeseBtn', 'sceltadateBtn');
		      break;
		    case "datecustom":
		      delete $scope.filter.QuartoTrimestre;
		      delete $scope.filter.filtroPrimoTrimestre;
		      delete $scope.filter.filtroSecondoTrimestre;
		      delete $scope.filter.filtroTerzoTrimestre;
		      delete $scope.filter.filtroMesePrec;
		      delete $scope.filter.filtroQstMese;
		      $scope.filter.filtroDataCustomStart = $scope.filt.dataCustomStart;
		      $scope.filter.filtroDataCustomEnd = $scope.filt.dataCustomEnd;
		      $scope.resetMenu('sceltadateBtn', 'quartotrimestreBtn', 'mesescorsoBtn', 'primotrimestreBtn', 'secondotrimestreBtn', 'terzotrimestreBtn', 'questomeseBtn');
		      break;
		    
		    default:
		      $scope.filter = null;
		  }
		//invocazione service
		PrimanotaService.getPrimanotaWithFilterList($scope.filter).then(function(response) {
	    	if(response!=null && response.data != null){
	    		$scope.primanotaList = response.data;	    		
	    	}    	
	    });
	    //eseguo all'ingresso in pagina
	    if(init){
	    	/*$("#contoBtn-1").addClass("disabled btn-default");
        	$("#contoBtn-1").prop("disabled", true);
        	$("#contoBtn-1").removeClass("btn-primary");	*/
	    }
	    
	}

	//open modale di inserimento utente
	$scope.openModalNewPrimanota = function () {

		$scope.transient.newPrimanota = {};
		$uibModal.open({
		templateUrl: './html/primanota/modalNewPrimanota.html',
		scope:$scope,
		backdrop:'static',
		size: 'md',	
		controller: function ($scope, $uibModalInstance) {
			$scope.createNewPrimanotaButton = function () {
				createNewPrimanota($uibModalInstance);
			};		
			$scope.cancelNewPrimanotaButton = function () {
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
	
 	 //open modale di edit utente
	$scope.openModalEditPrimanota = function (p_id) {

		//recupero utente
		PrimanotaService.getById(p_id).then(function(response) {  

			if(response!=null && response.data != null){

				$scope.persistent.idprimanota = response.data[0].IDPRIMANOTA;
				$scope.persistent.editPrimanota.datamovimento = $filter('date')(response.data[0].DATAMOVIMENTO, "dd/MM/yyyy");
				$scope.persistent.editPrimanota.cliente = response.data[0].ID_CLIENTE;
				$scope.persistent.editPrimanota.fornitore = response.data[0].ID_FORNITORE;
				$scope.persistent.editPrimanota.descrizione = response.data[0].DESCRIZIONE;					
				$scope.persistent.editPrimanota.idconto = response.data[0].ID_CONTO;
				$scope.persistent.editPrimanota.entrata = response.data[0].ENTRATA;
				$scope.persistent.editPrimanota.uscita = response.data[0].USCITA;

			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}

			/*
	    	if(response!=null && response.data != null){
	    		$scope.persistent.editPrimanota = response.data[0];
	    		var patternDate = /(\d{2})\/(\d{2})\/(\d{4})/;
				$scope.persistent.editPrimanota.DATAMOVIMENTO = new Date($scope.formatDate($scope.persistent.editPrimanota.DATAMOVIMENTO).replace(patternDate,'$3-$2-$1'));
	    	}  */  	
	    });	

		$uibModal.open({
		templateUrl: './html/primanota/modalEditPrimanota.html',
		scope:$scope,	
		backdrop:'static',
		size: 'md',	
		controller: function ($scope, $uibModalInstance) {
			$scope.editPrimanotaButton = function () {
				editPrimanota($uibModalInstance);
			};		
			$scope.cancelEditPrimanotaButton = function () {
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

	$scope.askConfirmationDelete = function(p_id) {
    var message = "Sei sicuro di voler eliminare questa Primanota?";
    var modalHtml = '<div class="modal-body">' + message + '</div>';
    modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeletePrimanota()">OK</button><button class="btn btn-warning" ng-click="cancelDelete()">Cancel</button></div>';

    $uibModal.open({
		template: modalHtml,
		scope:$scope,
		backdrop:'static',		
		controller: function ($scope, $uibModalInstance) {
			$scope.confirmDeletePrimanota = function () {
				$scope.removePrimanota(p_id);
				$uibModalInstance.dismiss('cancel');
			};		
			$scope.cancelDelete = function () {
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
	 
	$scope.removePrimanota = function (p_id){
		console.log("removePrimanota = " + p_id);
		PrimanotaService.removePrimanota(p_id).then(function(response) {  
	    	if(response!=null && response.data != null){
				console.log("Primanota eliminato "); 
				toastr.success("Operazione eseguita con successo");	
				$scope.getPrimanotaList();
				$scope.readAccounts();
	    	}    	
	    });				
	}

	$scope.openDatePicker = function (){
		if ($('.daterangepicker').css('display') == 'none') {
			$('.daterangepicker').show();
		}else{
			$('.daterangepicker').hide();
		}
	}

	$(".cancelBtn").click($('.daterangepicker').hide());

	$scope.resetButton = function (idCurrentField, idField1, idField2){

		$("#" + idCurrentField).addClass("disabled btn-default");
		$("#" + idCurrentField).prop("disabled", true);
	    $("#" + idCurrentField).removeClass("btn-primary");
	    $("#" + idField1).removeClass("disabled btn-default");
	    $("#" + idField1).prop("disabled", false);
	    $("#" + idField1).addClass("btn-primary");
	    if(idField2 !=""){
	    	$("#" + idField2).removeClass("disabled btn-default");
	    	$("#" + idField2).prop("disabled", false);
	    	$("#" + idField2).addClass("btn-primary");
	    }
	}

	$scope.resetButtonAccount = function (idCurrentAccount){

		//resetto tutti i pulsanti account
		jQuery.each( $scope.accountsList, function( i, account ) {
			$("#contoBtn" + account.ID_CONTO).removeClass("disabled btn-default");
	    	$("#contoBtn" + account.ID_CONTO).prop("disabled", false);
	    	$("#contoBtn" + account.ID_CONTO).addClass("btn-primary");
		});	
		
		//Dsabilito button corrente
		$("#" + idCurrentAccount).addClass("disabled btn-default");
		$("#" + idCurrentAccount).prop("disabled", true);
		$("#" + idCurrentAccount).removeClass("btn-primary");
	    
	}

	$scope.resetMenu = function (idCurrentMenu, idMenu1, idMenu2, idMenu3, idMenu4, idMenu5, idMenu6){

		$("#" + idCurrentMenu).addClass("active");
	    $("#" + idMenu1).removeClass("active");
	    $("#" + idMenu2).removeClass("active");
	    $("#" + idMenu3).removeClass("active");
	    $("#" + idMenu4).removeClass("active");
	    $("#" + idMenu5).removeClass("active");
	    $("#" + idMenu6).removeClass("active");
	    $('.daterangepicker').hide();
    
	}

	$scope.valDescConto= function (idConto){

		jQuery.each( $scope.accountsList, function( i, account ) {
			if(account.ID_CONTO === idConto){
				$scope.descContoSelected = account.DESCRIZIONE;
			}
		});

	}

	$scope.checkPositive = function (value){
		if(parseFloat(value) >= 0){
			return 'true';
		}else{
			return 'false';
		}
	}

	$scope.formatDate = function(data){
		var date = new Date(data);
		return date.toLocaleDateString('en-GB')
	}

	$scope.calcolaRangeDate = function(anno, meseFrom, meseTo){
		meseFrom = meseFrom.toString().length==1?"0"+meseFrom:meseFrom;
		meseTo = meseTo.toString().length==1?"0"+meseTo:meseTo;
		var datestart = "01" + "/" + meseFrom + "/" + anno;
		var ultimoGiornoMese = 	new Date(anno,meseTo,0);
		var dateend = ultimoGiornoMese.getDate().toString() +"/"+ meseTo +"/"+anno;
		var patternDate = /(\d{2})\/(\d{2})\/(\d{4})/;
		$scope.filt.dataCustomStart = $scope.formatDate(new Date(datestart.replace(patternDate,'$3-$2-$1')));
		$scope.filt.dataCustomEnd = $scope.formatDate(new Date(dateend.replace(patternDate,'$3-$2-$1')));
	}

	// END PUBLIC FUNCTIONS

	//init page
	//$scope.calcolaRangeDate($scope.annoCorrente, $scope.meseCorrente, $scope.meseCorrente);
	$scope.getPrimanotaWithFilterList(true, 'questomese', true);
    //$scope.getPrimanotaList();
	$scope.readAccountsAzienda($scope.labels.idAzienda);
	$scope.readAccounts();

    $scope.getCustomersList();
	
	//private functions
	function createNewPrimanota($uibModalInstance){
		console.log("createNewPrimanota");
		
		//adding default values
		PrimanotaService.createPrimanota($scope.transient.newPrimanota).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("Primanota creata"); 
				$uibModalInstance.dismiss('cancel');
				$scope.getPrimanotaList(); 
				$scope.readAccountsAzienda($scope.labels.idAzienda);
				$scope.readAccounts();
				toastr.success("Operazione eseguita con successo");					
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}		    
		});
	}

	function editPrimanota($uibModalInstance){
		console.log("editPrimanota");
		
		//adding default values
		PrimanotaService.editPrimanota($scope.persistent.editPrimanota, $scope.persistent.idprimanota).then(function(response) {  
			
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("Primanota modificato"); 
				$uibModalInstance.dismiss('cancel');
				$scope.getPrimanotaList();
				$scope.readAccountsAzienda($scope.labels.idAzienda);
				$scope.readAccounts();
				toastr.success("Operazione eseguita con successo");					
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}		    
			
		
		});
	}

}]);

