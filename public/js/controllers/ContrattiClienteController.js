angular.module("gestionaleApp")
.controller("ContrattiClienteController",
 ['$scope','$uibModal','filterFilter','$filter','$window','$location','$sessionStorage','ClienteService','FattureService','CommonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, filterFilter,$filter,$window,$location,$sessionStorage, ClienteService,FattureService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};	
	$scope.temp = {};
	$scope.temp.campoDiRicercaCliente;
	$scope.clienti = [];		
		
	$scope.idClienteSelezionato = 0;

	$scope.clientTypeaheadList = [];
	$scope.clientTypeaheadItem = {};

	$scope.filters = {};
	$scope.filters.filter = {};
	$scope.rigaFattura = {};

	$scope.dtOptionsListaArticoli = DTOptionsBuilder.newOptions()
	.withOption('responsive', true)
	.withOption('paging', false)
	.withOption('lengthChange', false)
	.withOption('bInfo', false)	
	.withOption('order', [])
	.withOption('bFilter', false)
	.withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefsListaArticoli = [
		DTColumnDefBuilder.newColumnDef(0).notSortable().withOption('width', '5%'),
		DTColumnDefBuilder.newColumnDef(1).notSortable().withOption('width', '5%'),
		DTColumnDefBuilder.newColumnDef(2).notSortable().withOption('width', '40%'),
		DTColumnDefBuilder.newColumnDef(3).notSortable().withOption('width', '5%'),
		DTColumnDefBuilder.newColumnDef(4).notSortable().withOption('width', '10%'),
		DTColumnDefBuilder.newColumnDef(5).notSortable().withOption('width', '25%'),
		DTColumnDefBuilder.newColumnDef(6).notSortable().withOption('width', '5%')
	];
	
	$scope.dtOptions = DTOptionsBuilder.newOptions()
	.withOption('responsive', true)
	.withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs = [          
		DTColumnDefBuilder.newColumnDef(6).notSortable()
	];

	// START PUBLIC FUNCTIONS

	$scope.getCustomersList = function (){
		//invocazione service

		ClienteService.getClientiWithContracts().then(function(response) { 
			
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.customersList = response.data.customers;	 
				//Popolo lista typeahead
				jQuery.each( $scope.customersList, function( i, customer ) {
					$scope.clientTypeaheadItem = {'ID' : customer.ID, 'DESCRIZIONE' : customer.NOME + (customer.PARTITA_IVA?' - ' + customer.PARTITA_IVA:'') + (customer.CODICE_FISCALE?' - ' + customer.CODICE_FISCALE:'')};
					$scope.clientTypeaheadList.push($scope.clientTypeaheadItem);
				});
			} else {
				toastr.error("errore ricerca cliente"); 
				console.error("ricerca cliente");	
			}
	    	    	
	    });

	}
/*
	$scope.selectArt = function ($item, index) {
	    debugger;
	};
*/
	$scope.onSelectClient = function ($item, $model, $label) {
	    //match con la lista clienti precedentemente caricata dal servizio ricerca clienti
	    $scope.clienteModel = $filter("filter")($scope.customersList, {ID: $item.ID})[0];
	    //TODO popolare variabili di scope per visualizzare dati cliente
		$scope.getElencoContrattiByCli();
	};

	$scope.getElencoContrattiByCli = function(){		
		ClienteService.getElencoContrattiByCli($scope.clienteModel.ID).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.contratti = response.data.contracts;
				$scope.contratti.counterNotific = $scope.contratti.length;
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}

	$scope.openModalNewFattura = function (p_id, dateLastFatt) {

		ClienteService.getContrattoClienteById($scope.clienteModel.ID, p_id).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
	    		$scope.transient.newFattura = {};
	    		$scope.transient.newFattura.contract = {};
	    		$scope.temp.contractStart = response.data.contratto.contractStart;
	    		var contractStart = new Date(moment($scope.temp.contractStart, 'DDMMYYYY').toDate());
				$scope.transient.newFattura.contract.scadenza = contractStart.setMonth(contractStart.getMonth() + response.data.contratto.contractDuration);
				$scope.transient.newFattura.contract.scadenza = moment($scope.transient.newFattura.contract.scadenza).format("DD/MM/YYYY");
				$scope.transient.newFattura.contract.labelscadenza = "IMMEDIATO"
				$scope.temp.contractDetails = response.data.contratto.contractDetails;

				//Recupero codice e descrizione dell'iva dalla lista in sessione
				jQuery.each( $scope.temp.contractDetails, function( i, riga ) {
					$scope.ivaObj = $filter("filter")($sessionStorage.listaIvaApplicata, {VALORE: riga.articoloIva})[0];
					riga["articoloCodIva"] = $scope.ivaObj.CODICE;
					riga["articoloDescIva"] = $scope.ivaObj.DESCRIZIONE;
				});

	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});


		if(dateLastFatt){
			var message = "E' stata generata una fattura per il presente contratto il "+dateLastFatt+" sicuro di voler procedere?";
			var modalHtml = '<div class="modal-body">' + message + '</div>';
			modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmNewFattura()">OK</button><button class="btn btn-warning" ng-click="cancelNewFattura()">Cancel</button></div>';

			$uibModal.open({
				template: modalHtml,
				scope:$scope,
				backdrop:'static',		
				controller: function ($scope, $uibModalInstance) {
					$scope.confirmNewFattura = function () {
						$uibModalInstance.dismiss('cancel');
						openGeneraFattura(p_id);
					};		
					$scope.cancelNewFattura = function () {
						//$uibModalInstance.close(false);
						$uibModalInstance.dismiss('cancel');
					};
				}
				}).result.catch(function(res) {
					if (!(res === 'cancel' || res === 'escape key press')) {
						throw res;
					}
				});    
			}else{
				openGeneraFattura(p_id);
			}
 	 };

 	 

	// END PUBLIC FUNCTIONS

	//init page
	$scope.getCustomersList();
	
	
	//private functions
	function calcoloIva(prezzo, iva) {
		var totIvato = (prezzo/100)*(100+iva);
	  	return totIvato.toFixed(2);
	}

	function openGeneraFattura(p_id){
		$uibModal.open({
		templateUrl: './html/clienti/modalNewFattura.html',
		scope:$scope,
		backdrop:'static',
		size: 'lg',	
		controller: function ($scope, $uibModalInstance) {
			$scope.createNewFatturaButton = function () {
				createNewFattura($uibModalInstance, p_id);
			};		
			$scope.cancelNewFatturaButton = function () {
				//$uibModalInstance.close(false);
				$uibModalInstance.dismiss('cancel');
			};
		}
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
	}

	function createNewFattura($uibModalInstance, p_id){
		console.log("createNewFattura");
		$scope.transient.newFattura.contract.importo = 0;
		$scope.transient.newFattura.contract.righe = [];
		jQuery.each( $scope.temp.contractDetails, function( i, riga ) {
			
			if(riga.checked){
				$scope.rigaFattura.qty = riga.qty
				$scope.rigaFattura.idArticolo = riga.articoloId
				$scope.rigaFattura.descrizione = riga.descArticolo
				$scope.rigaFattura.prezzoUnitario = riga.articoloPrice
				$scope.rigaFattura.sconto = 0;
				$scope.rigaFattura.iva = riga.articoloCodIva
				$scope.rigaFattura.totaleRiga = riga.articoloPrice*riga.qty;
				$scope.rigaFattura.totaleRigaIvato = parseFloat(calcoloIva($scope.rigaFattura.totaleRiga, riga.articoloIva));
				$scope.rigaFattura.codiceArticolo = riga.codiceArticolo
				$scope.transient.newFattura.contract.importo += $scope.rigaFattura.totaleRigaIvato;
				$scope.transient.newFattura.contract.righe.push($scope.rigaFattura);
			}
		});
		if($scope.transient.newFattura.contract.righe.length > 0){
			ClienteService.creaFatturaDaContratto($scope.clienteModel.ID, $scope.transient.newFattura, p_id).then(function(response) {  
		    	if(response!=null && response.data != null && response.data.status =='OK'){
					toastr.success("Fattura creata con successo");
					$uibModalInstance.dismiss('cancel');
					//$location.url("/fatture/modificaFattura/"+response.data.idFattura);
					$scope.creaPdfFattura(response.data.idFattura,'IMME');
		    	} else {
					toastr.error("errore creazione Fattura Cliente");				
				}    	
			});
		}else{
			toastr.error("Errore, è necessario selezionare almeno un articolo dal contratto");
		}
		
		
	}

	$scope.creaPdfFattura = function(p_id,tipoFattura){	
		
		FattureService.creaPdfFattura(p_id).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
			if(handleResponseResult.next){
				console.log("pdf creato correttamente");
				var urlTemp = $location.protocol()+":\/\/"+$location.host()+":"+$location.port();
				$window.open(urlTemp+"/pdf/show/"+tipoFattura+"/"+response.data.nomeFile);						
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " );
			}  	
		});	
	}


}]);

