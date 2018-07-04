angular.module("gestionaleApp")
.controller("DettaglioFatturaController",
 ['$scope', '$uibModal','$location','$filter', '$window', '$rootScope', '$routeParams','$sessionStorage', 'FattureService', 'ClienteService',
 function ($scope, $uibModal, $location, $filter, $window, $rootScope, $routeParams,$sessionStorage, FattureService, ClienteService) {
	'use strict';
	$scope.temp = {};
	$scope.persistent = {};
	$scope.persistent.idFattura = $routeParams.idFattura;
	$scope.persistent.fattura = {};
	$scope.persistent.fattura.core = {};	
	$scope.persistent.fattura.header = {};	
	$scope.persistent.fattura.righe = [];	
	$scope.persistent.fattura.scadenza = [];
	
	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;
	$scope.tipoFattureList = $sessionStorage.tipoFattureList;

	// START PUBLIC FUNCTIONS
	
	$scope.gotoElencoFatture = function(){	
		$rootScope.tipoFatturaCod = $scope.persistent.fattura.core.tipoFattura;
		$rootScope.tipoFatturaDesc = $scope.temp.descTipofattura;	
		$location.url('/fatture');
	}
	
	$scope.emettiPagamento= function(){	
		alert("TODO emissione pagamento");
	}

$scope.loadDatiFattura = function () {

		//testata
		FattureService.getFatturaTestataById($scope.persistent.idFattura).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){				
			
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}  
		});

		//core
		FattureService.getFatturaCoreById($scope.persistent.idFattura).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.persistent.fattura.core.numero = response.data.fattura.NUMERO;
				$scope.persistent.fattura.core.annoRif = response.data.fattura.ANNO_RIF;
			
				$scope.persistent.fattura.core.idCliente = response.data.fattura.ID_CLIENTE;	
				$scope.persistent.fattura.core.tipoFattura = response.data.fattura.TIPO_FATTURA;	
				$scope.persistent.fattura.core.trasportoACura = response.data.fattura.TRASPORTO_A_CURA;	
				$scope.persistent.fattura.core.numColli = response.data.fattura.NUM_COLLI;	
				$scope.persistent.fattura.core.pesoKg = response.data.fattura.PESO_KG;	
				$scope.persistent.fattura.core.conducente = response.data.fattura.CONDUCENTE;	
				$scope.persistent.fattura.core.noteTrasporto = response.data.fattura.NOTE_TRASPORTO;				
				$scope.persistent.fattura.note = response.data.fattura.NOTE;
				$scope.persistent.fattura.core.idConto = response.data.fattura.ID_CONTO;
				$scope.persistent.fattura.core.modalitaPagamento = response.data.fattura.ID_MOD_PAGAMENTO;
				$scope.persistent.fattura.core.dataEmissione = $filter('date')(response.data.fattura.DATA_EMISSIONE, "dd/MM/yyyy");
				$scope.persistent.fattura.core.dataScadenza = $filter('date')(response.data.fattura.DATA_SCADENZA, "dd/MM/yyyy"); 
				$scope.persistent.fattura.core.idProgetto = response.data.fattura.ID_PROGETTO;
				$scope.persistent.fattura.core.statoFattura=response.data.fattura.DESCRIZIONE_STATO;
				
				jQuery.each( $scope.tipoFattureList, function( i, typeFatt ) {
					if(typeFatt.ID === $scope.persistent.fattura.core.tipoFattura){
						$scope.temp.descTipofattura = typeFatt.DESCRIZIONE;
					}
				});

				//header fattura
				$scope.loadDatiCliente(response.data.fattura.ID_CLIENTE);			
			
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}  
		});

		//righe
		FattureService.getFatturaRigheById($scope.persistent.idFattura).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){				
			
			angular.forEach(response.data.righeFattura, function(item){
				var riga = {};
				riga.descrizione = item.DESCRIZIONE;
				riga.qty = item.QTY;
				riga.prezzoUnitario = item.PREZZO_UNITARIO;
				riga.sconto = item.SCONTO;
				riga.iva = item.IVA;

				riga.totaleRiga = calcolaTotaleSenzaIva(item.PREZZO_UNITARIO,item.QTY,item.SCONTO);
				riga.codiceArticolo = item.CODICE_ARTICOLO;
				riga.totaleRigaIvato = calcolaTotaleConIva(riga.prezzoUnitario,riga.qty,riga.sconto,riga.iva);


				
				$scope.persistent.fattura.righe.push(riga);
			});	
			aggiornaTotaliFattura();
			
			
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}  
		});

		//scadenzario
		FattureService.getFatturaScadenzeById($scope.persistent.idFattura).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){				
				
				angular.forEach(response.data.scadenze, function(item){
				var scadObj = {};
				scadObj.id = item.ID;
				scadObj.importo = item.IMPORTO;
				scadObj.label = item.LABEL;
				scadObj.scadenza = item.DATA_SCADENZA;				
				scadObj.stato = item.STATO;				
				$scope.persistent.fattura.scadenza.push(scadObj);
			});

			
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}  
		});
		
		$scope.loadDatiCliente = function (id_cliente) {	    
		
			ClienteService.getClienteByIdDettFatt(id_cliente).then(function(response) {  
		    	if(response!=null && response.statusText == 'OK' && response.data != null){					
					$scope.clienteModel = response.data.customer;
		    	}    	
		    });	
		};

		
	}

	$scope.gotoNuovaFattura = function(tipoFattura){
		//Inserimento fattura con dati cliente prefillati
		$rootScope.clienteModel = $scope.clienteModel;
		$location.url('fatture/inserisciFattura/'+tipoFattura);
	}

	$scope.openModalGeneraNDCR = function (pIdFattura) {		
		$scope.idFattura = pIdFattura;
		$uibModal.open({
		templateUrl: './html/fatture/modalGeneraNdc.html',
		scope:$scope,	
		backdrop:'static',		
		controller: 'NotaCreditoController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };

	// END PUBLIC FUNCTIONS

	//init page	
	
	$scope.loadDatiFattura();


	$scope.creaPdfFattura = function(p_id,tpoFattura){	
	
		FattureService.creaPdfFattura(p_id).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("pdf creato correttamente");
				var urlTemp = $location.protocol()+":\/\/"+$location.host()+":"+$location.port();
				$window.open(urlTemp+"/pdf/show/"+tipoFattura+"/"+response.data.nomeFile);						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}  	
	    });	
	}
	

	//private function
	function calcolaTotaleSenzaIva(prezzo,quantita,sconto){
		if(sconto > 0){
			return ((prezzo*quantita) - (((prezzo*quantita)/100)*sconto));
		} else {
			return (prezzo*quantita);
		}		
	}

	function calcolaTotaleConIva(prezzo,quantita,sconto, iva){		
		var ivaObj = $filter('filter')($scope.listaIvaApplicata, {'CODICE': iva})[0];
		var valIva = (ivaObj.VALORE !== undefined && ivaObj.VALORE!==null)?1+(ivaObj.VALORE)/100:1;
		if(sconto > 0){//TODO CAPIRE se su prezzo socntato oppure no
			return ((prezzo*quantita) - (((prezzo*quantita)/100)*sconto)) * valIva;
		} else {
			return (prezzo*quantita) * valIva;
		}		
	}


	function aggiornaTotaliFattura(){

		//aggiorna totale fattura
		$scope.persistent.fattura.totaleFattura = 0;
		$scope.persistent.fattura.totaleFatturaIvato = 0;
		angular.forEach($scope.persistent.fattura.righe, function(item){
			
			$scope.persistent.fattura.totaleFattura = $scope.persistent.fattura.totaleFattura + item.totaleRiga; 
			$scope.persistent.fattura.totaleFatturaIvato = $scope.persistent.fattura.totaleFatturaIvato + item.totaleRigaIvato; 
		});

		}

		

}]);

