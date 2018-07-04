angular.module("gestionaleApp")
.controller("NuovaFatturaController",
 ['$scope','$uibModal','filterFilter','$window','$route','$rootScope', '$routeParams','$location','$sessionStorage','ClienteService', 'ArticoliService','CommonService', 'FattureService', '$filter', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, filterFilter,$window,$route,$rootScope, $routeParams, $location,$sessionStorage, ClienteService, ArticoliService, CommonService, FattureService, $filter, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	
	$scope.model ={};			
	$scope.temp = {};
	$scope.temp.campoDiRicercaCliente;
	$scope.temp.campoDiRicercaArticolo;
	$scope.temp.ricercaAvanzata = {};
	$scope.temp.ricercaAvanzata.codiceArticolo;
	$scope.temp.ricercaAvanzata.descrizione;
	$scope.temp.labelThirdStep = "Pagamenti e note";

	//steppers	
	$scope.temp.steppers = {};
	$scope.temp.steppers.selected = 0;
	$scope.temp.steppers.step0 = {};
	$scope.temp.steppers.step0.disabled = false;	
	$scope.temp.steppers.step0.completed = false;
	$scope.temp.steppers.step1 = {};
	$scope.temp.steppers.step1.disabled = true;	
	$scope.temp.steppers.step1.completed = false;
	$scope.temp.steppers.step2 = {};
	$scope.temp.steppers.step2.disabled = true;	
	$scope.temp.steppers.step2.completed = false;
	$scope.temp.steppers.step3 = {};
	$scope.temp.steppers.step3.disabled = true;		
	$scope.temp.steppers.step3.completed = false;	
	//fine steppers
	$scope.transient = {};
	$scope.transient.nuovaFattura = {};
	$scope.transient.nuovaFattura.core = {};
	$scope.transient.nuovaFattura.header = {};	
	$scope.transient.nuovaFattura.righe = [];	
	$scope.transient.nuovaFattura.totaleFattura = 0;
	$scope.transient.nuovaFattura.totaleFatturaIvato = 0;
	$scope.transient.nuovaFattura.scadenza = null;
	$scope.transient.nuovaFattura.core.idConto="-1";
	$scope.transient.nuovaFattura.core.modalitaPagamento="-1";
	$scope.transient.nuovaFattura.core.dataEmissione = $filter('date')(new Date(), "dd/MM/yyyy");
	//Tipo Fattura
	$scope.transient.nuovaFattura.core.tipoFattura = $routeParams.tipoFattura;

	$scope.persistent = {};
	$scope.persistent.clienteSelezionato = {};
	$scope.persistent.articoliRicercaAvanzata = [];
	$scope.persistent.elencoConti = [];
	$scope.sezioneRichiamante = "nuovaFattura";

	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;
	$scope.listaPagamentoFatture = $sessionStorage.listaPagamentoFatture;
	$scope.tipoFattureList = $sessionStorage.tipoFattureList;
	$scope.filtRange = {};
	$scope.minDateScad = $filter('date')(new Date(), "dd/MM/yyyy");

	//Gestione Typeahead
	$scope.clientTypeaheadList = [];
	$scope.clientTypeaheadItem = {};
	$scope.noResults = false;

	//tabella elenco articoli in fattura
	$scope.dtOptionsListaArticoli = DTOptionsBuilder.newOptions()
	.withOption('responsive', true)
	.withOption('paging', false)
	.withOption('lengthChange', false)
	.withOption('bInfo', false)	
	.withOption('order', [])
	.withOption('bFilter', false)
	.withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefsListaArticoli = [          
		DTColumnDefBuilder.newColumnDef(0).notSortable().withOption('width', '3%'),
		DTColumnDefBuilder.newColumnDef(1).notSortable().withOption('width', '25%'),
		DTColumnDefBuilder.newColumnDef(2).notSortable().withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(3).notSortable().withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(4).notSortable().withOption('width', '20%'),
		DTColumnDefBuilder.newColumnDef(5).notSortable().withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(6).notSortable().withOption('width', '10%'),
		DTColumnDefBuilder.newColumnDef(7).notSortable().withOption('width', '12%'),
		DTColumnDefBuilder.newColumnDef(8).notSortable().withOption('width', '3%')
	];

	//tabella articoli ricerca avanzata
	$scope.dtOptions_ArticoloRicercaAvanzata = DTOptionsBuilder.newOptions().withOption('responsive', true).withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs_ArticoloRicercaAvanzata = [          
		DTColumnDefBuilder.newColumnDef(2).notSortable()
	];

	// START PUBLIC FUNCTIONS
	
	$scope.gotoElencoFatture = function(){
		$rootScope.tipoFatturaCod = $routeParams.tipoFattura;
		$rootScope.tipoFatturaDesc = $scope.temp.descTipofattura;
		$location.url('/fatture');
	}
	
	$scope.cercaCliente = function(){
		/*
		ClienteService.getClientiList().then(function(response) {  	
	    	if(response!=null && response.data != null){
				$scope.clienti = response.data;	 
						
	    	}    	
		});
			*/
		//TODO POPOLAMENTO DATI CLIENTE STATICO - RECUPERARE DA SERVIZIO
	$scope.transient.nuovaFattura.core.idCliente="-1";
	$scope.transient.nuovaFattura.core.modalitaPagamento="-1";
	$scope.transient.nuovaFattura.header.nome = "nomeCliente";
	$scope.transient.nuovaFattura.header.ragSocialeCliente ="ragSociaeCliente";
	$scope.transient.nuovaFattura.header.indirizzoCliente = "indirizzoCliente";
	$scope.transient.nuovaFattura.header.emailCliente = "emailCliente";
	$scope.transient.nuovaFattura.header.telCliente = "11";
	$scope.transient.nuovaFattura.header.faxCliente = "222";
	$scope.transient.nuovaFattura.header.rifCliente = "rifCliente";
	$scope.transient.nuovaFattura.header.ibanCliente = "ibanCliente";
	$scope.transient.nuovaFattura.header.label = "label";
	$scope.transient.nuovaFattura.header.ragSocialeMM = "ragSocialeMM";
	$scope.transient.nuovaFattura.header.indirizzoMM = "indirizzoMM";
	$scope.transient.nuovaFattura.header.emailMM = "emailMM";
	$scope.transient.nuovaFattura.header.telMM = 111;
	$scope.transient.nuovaFattura.header.faxMM = 1111;
	$scope.transient.nuovaFattura.header.rifMM = "rifMM";
	$scope.transient.nuovaFattura.header.ibanMM = "ibanMM"; 
	}
	
	$scope.resetCliente = function (){
		$scope.temp.campoDiRicercaCliente= "";
		$scope.transient.nuovaFattura.core = {};
		$scope.transient.nuovaFattura.header = {};
		$scope.persistent.elencoConti = [];
		//reset stepper data
		$scope.temp.steppers.selected = 0;	
		$scope.temp.steppers.step1.disabled = false;	
		$scope.temp.steppers.step1.completed = false;
		$scope.temp.steppers.step2.disabled = true;	
		$scope.temp.steppers.step2.completed = false;
		$scope.temp.steppers.step3.disabled = true;	
		$scope.temp.steppers.step3.completed = false;	
	}

	$scope.aggiungiArticolo = function (){
		//TODO effettuare la ricerca by codice articolo e popolare dinamicamente.
		//	   se articolo già presente in articoli, visualizzare popup e invitare a modificare la quantità
		if($scope.temp.campoDiRicercaArticolo==='' || $scope.temp.campoDiRicercaArticolo===undefined){
			toastr.warning("Inserire un codice articolo prima di cliccare su aggiungi");
		}else{
			//var esc=escapeHtml($scope.temp.campoDiRicercaArticolo);
			var articoloGiaPresente = $filter('filter')($scope.transient.nuovaFattura.righe,
				function(obj) {
					if(obj.codiceArticolo){
						return obj.codiceArticolo.trim().toUpperCase() === $scope.temp.campoDiRicercaArticolo.trim().toUpperCase();
					}else{
						//filtro su descrizione su articoli aggiunti manualmente perchè il codice articolo non è presente
						return obj.descrizione.trim().toUpperCase() === $scope.temp.campoDiRicercaArticolo.trim().toUpperCase();
					}
        			
    			});	 
			if(articoloGiaPresente !== null && articoloGiaPresente !== undefined 
				&& articoloGiaPresente.length > 0){
					toastr.warning("Articolo gia presente in fattura");
			} else {
			
					ArticoliService.getArticoloByCodice($scope.transient.nuovaFattura.core.idCliente,$scope.temp.campoDiRicercaArticolo,'IMME').then(function(response) {  
						
						var handleResponseResult = $scope.handleResponse(response);  
						if(handleResponseResult && handleResponseResult.next){							
								var articoloRicercato = response.data.articolo[0];
								if(articoloRicercato!=null && articoloRicercato!=undefined){
									$scope.temp.campoDiRicercaArticolo = "";
									// NON CAMBIARE ORDINE
									var nuovoArticolo = {};
									nuovoArticolo.qty = 1;
									nuovoArticolo.idArticolo = articoloRicercato.ID_ARTICOLO;
									nuovoArticolo.descrizione = articoloRicercato.DESCRIZIONE;
									nuovoArticolo.prezzoUnitario = articoloRicercato.PREZZO;
									nuovoArticolo.sconto = 0;
									nuovoArticolo.iva = articoloRicercato.IVA;
									nuovoArticolo.totaleRiga = calcolaTotaleSenzaIva(articoloRicercato.PREZZO,nuovoArticolo.qty,0);
									nuovoArticolo.totaleRigaIvato = calcolaTotaleConIva(articoloRicercato.PREZZO,nuovoArticolo.qty,0,articoloRicercato.IVA);	
									nuovoArticolo.codiceArticolo = articoloRicercato.CODICE_ARTICOLO;	
									nuovoArticolo.editable = false;

									//Gestione scrollbar
									if($scope.transient.nuovaFattura.righe.length > 1){
										$('.stepper-custom-latr').attr('style','min-height:80%;other-styles');
									}

									$scope.transient.nuovaFattura.righe.push(nuovoArticolo);

									aggiornaTotaliFattura();
								} else {
									toastr.warning("Articolo non trovato per il codice inserito ");
								}									
								
						}else {
							toastr.error(response.data.errorCode + " - errore ricerca articolo"); 
							console.error("errore ricerca articolo");				
						}
						
								
					});
			}	
		}
			
	}

	

$scope.aggiungiArticoloManuale = function (){
				
		var articoloGiaPresente = $filter('filter')($scope.transient.nuovaFattura.righe, {'descrizione': $scope.temp.campoDiRicercaArticolo});
				if(articoloGiaPresente !== null && articoloGiaPresente !== undefined 
					&& articoloGiaPresente.length > 0){
						toastr.warning("Articolo gia presente in fattura");
				} else {
										
						var nuovoArticolo = {};
						nuovoArticolo.qty = 1;
						nuovoArticolo.idArticolo = null;
						nuovoArticolo.descrizione = $scope.temp.campoDiRicercaArticolo;
						nuovoArticolo.prezzoUnitario = 0;
						nuovoArticolo.sconto = 0;
						nuovoArticolo.iva = 0;
						nuovoArticolo.totaleRiga = calcolaTotaleSenzaIva(nuovoArticolo.prezzoUnitario,nuovoArticolo.qty,0);
						nuovoArticolo.totaleRigaIvato = calcolaTotaleConIva(nuovoArticolo.prezzoUnitario,nuovoArticolo.qty,0,nuovoArticolo.iva);	
						nuovoArticolo.codiceArticolo = null;	
						
						$scope.transient.nuovaFattura.righe.push(nuovoArticolo);
						$scope.temp.campoDiRicercaArticolo = "";
						aggiornaTotaliFattura();
				
				}		
	}

	//open modale di inserimento utente
	$scope.openModalRicercaArticolo = function (pCodiceArticolo) {
		//recupero articoli		
		
		//invocazione service - INIZIALMENTE non carichiamo nulla
		/*
		ArticoliService.getArticoliList().then(function(response) {  
	    	if(response!=null && response.data != null){
				$scope.persistent.articoliRicercaAvanzata = response.data;	 						
	    	} else {
				toastr.error("Errore: "+ response.data.errMessage + " - GESTIONE ERRORE DA FARE!!!" );
			}  	
		});		
		*/
		//clear list and filter
		$scope.persistent.articoliRicercaAvanzata = [];
		$scope.temp.ricercaAvanzata = {};
		if(pCodiceArticolo != undefined && pCodiceArticolo != null){
			$scope.temp.ricercaAvanzata.codiceArticolo = pCodiceArticolo;
		}
		$uibModal.open({
		templateUrl: './html/fatture/modalRicercaArticoli.html',
		scope:$scope,
		backdrop:'static',	
		size: 'lg',	
		controller: function ($scope, $uibModalInstance) {
			$scope.aggiungiArticoloDaRicercaAvanzata = function (articolo) {			
				$scope.spinner.on();
				var articoloGiaPresente = $filter('filter')($scope.transient.nuovaFattura.righe, {'idArticolo': articolo.ID_ARTICOLO});
				if(articoloGiaPresente !== null && articoloGiaPresente !== undefined 
					&& articoloGiaPresente.length > 0){
						$scope.spinner.off();
						toastr.warning("Articolo gia presente in fattura");
				} else {
					// NON CAMBIARE ORDINE
					var nuovoArticolo = {};
					nuovoArticolo.qty = 1;
					nuovoArticolo.idArticolo = articolo.ID_ARTICOLO;
					nuovoArticolo.descrizione = articolo.DESCRIZIONE;
					nuovoArticolo.prezzoUnitario = articolo.PREZZO;
					nuovoArticolo.sconto = 0;
					nuovoArticolo.iva = articolo.CODICE_IVA;
					nuovoArticolo.totaleRiga = calcolaTotaleSenzaIva(articolo.PREZZO,nuovoArticolo.qty,nuovoArticolo.sconto);
					nuovoArticolo.totaleRigaIvato = calcolaTotaleConIva(articolo.PREZZO,nuovoArticolo.qty,nuovoArticolo.sconto,articolo.IVA);	     
					nuovoArticolo.codiceArticolo = articolo.CODICE_ARTICOLO; 
					$scope.transient.nuovaFattura.righe.push(nuovoArticolo);
					aggiornaTotaliFattura();
					//$uibModalInstance.dismiss('cancel');
					setTimeout( function() {                    
                   		 $scope.spinner.off();
           			}, 400 );

				}			
			};		
			$scope.cancelRicercaAvanzataButton = function () {
				//$uibModalInstance.close(false);
				$uibModalInstance.dismiss('cancel');
			};
			$scope.aggiungiNuovoArticoloButton = function () {
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

	  //open modale di inserimento articolo
	$scope.openModalNewArticolo = function () {		
		$scope.transient.newArticolo = {};
		$uibModal.open({
		templateUrl: './html/articoli/modalNewArticolo.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: "NuovoArticoloController"
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };

	 $scope.eseguiRicercaAvanzata = function (event){
		var filterObj = {};
		
		//filterObj.ivaProdotto = 10;
		//filterObj.ivaServizio = 0;//TODO		
		filterObj.code=$scope.temp.ricercaAvanzata.codiceArticolo;
		filterObj.descrizione = $scope.temp.ricercaAvanzata.descrizione;
		filterObj.idCliente = $scope.transient.nuovaFattura.core.idCliente;

		ArticoliService.getArticoliByRicercaAvanzata(filterObj,null,null).then(function(response) { 
			
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.persistent.articoliRicercaAvanzata = response.data.articoli;	
			} else {
				toastr.error("Errore: "+ response.data.errMessage + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	 	
		});

	 }


	$scope.calcolaTotaleRiga = function (indexValue){		
		var currentRow = $scope.transient.nuovaFattura.righe[indexValue];		
		if(currentRow!=undefined && currentRow!=null){
			currentRow.totaleRiga = calcolaTotaleSenzaIva(currentRow.prezzoUnitario,currentRow.qty,currentRow.sconto);
			currentRow.totaleRigaIvato = calcolaTotaleConIva(currentRow.prezzoUnitario,currentRow.qty,currentRow.sconto, currentRow.iva);
		}
		aggiornaTotaliFattura();
	}

	$scope.eliminaArticoloDaFattura = function (indexValue){
		$scope.transient.nuovaFattura.righe.splice(indexValue, 1);
		aggiornaTotaliFattura();	
	}

	

	// END PUBLIC FUNCTIONS
		

	//Gestione Typeahead
	//funzione che recupera la lista dei clienti
	$scope.getCustomersList = function (){
		//invocazione service

		//controllo se vengo da scheda cliente
		if($rootScope.clienteModel){
			popolaSezioneCliente($rootScope.clienteModel);
			$scope.clienteModel = angular.copy($rootScope.clienteModel);
			delete $rootScope.clienteModel;
		}

		//Gestione intestazione step condizionato da tipo fattura e col-md per grafica primo step
		$scope.colTypeDoc = "col-md-5";
		if($routeParams.tipoFattura === "DDT"){
			$scope.temp.labelThirdStep = "Condizioni trasporto";
			$scope.colTypeDoc = "col-md-7";
		}

		if($routeParams.tipoFattura === "FACC"){
			$scope.temp.labelThirdStep = "Condizioni trasporto, pagamenti e note";
		}

		if($routeParams.tipoFattura === "PROF"){
			$scope.temp.labelThirdStep = "Note";
			$scope.colTypeDoc = "col-md-7";
		}

		ClienteService.getClientiList().then(function(response) { 
			
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

		$scope.filtRange.tipofattura = $routeParams.tipoFattura;
		
		//range data emissione
		FattureService.getRangeDateEmissione($scope.filtRange).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){				
				$scope.minDate = response.data.dateFrom;					
				$scope.maxDate = response.data.dateTo;
			
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}  
		});	

	}

	$scope.reloadModPag = function (){
		$scope.transient.nuovaFattura.core.modalitaPagamento="-1";
		//invocazione service
		$scope.flagConto = $scope.transient.nuovaFattura.core.idConto!="-1" && $scope.transient.nuovaFattura.core.idConto!= undefined?true:false;
		CommonService.getPagamentoFattureList($scope.flagConto).then(function(response) {  
			if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaPagamentoFatture = response.data;
				$scope.listaPagamentoFatture  = response.data;
			}    	
		});
	}

	$scope.onSelectClient = function ($item, $model, $label) {
	    //match con la lista clienti precedentemente caricata dal servizio ricerca clienti
	    $scope.clienteModel = $filter("filter")($scope.customersList, {ID: $item.ID})[0];
		popolaSezioneCliente($scope.clienteModel);
	};

	$scope.onSelectClientPostCreazione = function (id_nuovo_cliente) {	    
		
		ClienteService.getClienteById(id_nuovo_cliente).then(function(response) {  
	    	if(response!=null && response.statusText == 'OK' && response.data != null){					
				popolaSezioneCliente(response.data);
	    	}    	
	    });	


	};

	$scope.addArt = function(event) {
		if(event.keyCode == 13) {
			$scope.aggiungiArticolo();
		}
	}

	//open modale di inserimento utente
	$scope.openModalNewCliente = function () {
		$scope.transient.newCliente = {};
		$uibModal.open({
		templateUrl: './html/clienti/modalNewCliente.html',
		scope:$scope,
		backdrop:'static',	
		size: 'lg',	
		controller: 'NuovoClienteController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };

	
	  $scope.nextStep0CheckCliente = function () {
		$scope.checkDatiCompleti = true;
		if($scope.transient.nuovaFattura.header.ragSocialeCliente ==='' ||  $scope.transient.nuovaFattura.header.ragSocialeCliente === undefined){
			$scope.checkDatiCompleti = false;
		}

		if($scope.transient.nuovaFattura.core.modalitaPagamento=="-1" && $scope.transient.nuovaFattura.core.tipoFattura!=='DDT' && $scope.transient.nuovaFattura.core.tipoFattura!=='PROF'){
			$scope.checkDatiCompleti = false;
		}

		if($scope.checkDatiCompleti){
			
			$scope.temp.steppers.selected = 1;
			$scope.temp.steppers.step1.disabled = false;
			$scope.temp.steppers.step0.completed = true;

		} else {
			toastr.warning("VERIFICARE CHE I DATI SIANO COMPLETI");
		}
		
	};

	$scope.backStep1 = function () {	
		$scope.temp.steppers.selected = 0;			
	};

	$scope.nextStep1CheckArticoli = function () {
		
		if($scope.transient.nuovaFattura.righe.length > 0 ){
			$scope.checkDatiCompleti = true;
			angular.forEach($scope.transient.nuovaFattura.righe, function(item){
				if( item.descrizione === null || item.descrizione === '' || item.qty === null || item.qty === 0) {
					$scope.checkDatiCompleti = false;
				}
				if((item.prezzoUnitario === null || item.prezzoUnitario === 0  || item.prezzoUnitario === undefined || 
					
					item.iva === null || item.iva === undefined || item.iva === 0 ||
					item.totaleRiga === null || item.totaleRiga === undefined || item.totaleRiga < 0
					) && ($scope.transient.nuovaFattura.core.tipoFattura!=='DDT')){
					$scope.checkDatiCompleti = false;
				}
			});

			if($scope.checkDatiCompleti){

				if($scope.transient.nuovaFattura.core.tipoFattura!=='DDT' && $scope.transient.nuovaFattura.core.tipoFattura!=='PROF'){
					$scope.transient.nuovaFattura.scadenza = [];
					$scope.spinner.on();
					FattureService.getPagamentoFattura($scope.transient.nuovaFattura.core.modalitaPagamento,
											$scope.transient.nuovaFattura.totaleFatturaIvato).then(function(response) {  	
						if(response!=null && response.data != null && response.statusText == 'OK'){
							
							angular.forEach(response.data, function(item){
								var objScadenza = {};	
								objScadenza.importo = item.ammontare;
								objScadenza.label = item.terminiDiPagamento;
								objScadenza.scadenza = item.scadenza;
								objScadenza.stato = "BOZZA";
								$scope.transient.nuovaFattura.scadenza.push(objScadenza);
							})
							
							//Logica se la tabella delle rate supera 3 righe
			
							if($scope.transient.nuovaFattura.core.tipoFattura==='FACC'){
								$('.stepper-custom-latr').attr('style','min-height:100%;other-styles');	
							}else if(($scope.transient.nuovaFattura.core.tipoFattura==='FACC' && $scope.transient.nuovaFattura.core.tipoFattura==='DDT' && $scope.transient.nuovaFattura.core.tipoFattura!=='PROF') || ($scope.transient.nuovaFattura.scadenza !==null && $scope.transient.nuovaFattura.scadenza !==undefined && $scope.transient.nuovaFattura.scadenza.length < 3)){
								$('.stepper-custom-latr').attr('style','min-height:85%;other-styles');	
							}else if($scope.transient.nuovaFattura.core.tipoFattura!=='FACC' && $scope.transient.nuovaFattura.core.tipoFattura!=='DDT' && $scope.transient.nuovaFattura.core.tipoFattura!=='PROF' && $scope.transient.nuovaFattura.scadenza !==null && $scope.transient.nuovaFattura.scadenza !==undefined && $scope.transient.nuovaFattura.scadenza.length < 4){
								$('.stepper-custom-latr').attr('style','min-height:90%;other-styles');	
							}else if($scope.transient.nuovaFattura.core.tipoFattura!=='FACC' && $scope.transient.nuovaFattura.core.tipoFattura!=='DDT' && $scope.transient.nuovaFattura.core.tipoFattura!=='PROF' && $scope.transient.nuovaFattura.scadenza !==null && $scope.transient.nuovaFattura.scadenza !==undefined && $scope.transient.nuovaFattura.scadenza.length < 5){
								$('.stepper-custom-latr').attr('style','min-height:95%;other-styles');	
							}else{
								$('.stepper-custom-latr').attr('style','min-height:100%;other-styles');	
							}
							
							$scope.spinner.off();
						}    	
					});	
				}else{
					$('.stepper-custom-latr').attr('style','min-height:85%;other-styles');	
				}

				$scope.temp.steppers.selected = 2;
				$scope.temp.steppers.step2.disabled = false;
				$scope.temp.steppers.step1.completed = true;
				
			} else {
				toastr.warning("VERIFICARE CHE I DATI SIANO COMPLETI");
			}

			//Scrollo la pagina verso l'alto
			$('.scroll-to-top').click();
				
					
		} else {
			toastr.warning("NON CI SONO ARTICOLI");
		}
		
	};
	
	$scope.backStep2 = function () {	
		$scope.temp.steppers.selected = 1;			
	};
	/* DOVREBBE ESSERE IN DISUSO 
	$scope.nextStep2 = function () {
		 var $scope.flagNext = true;

		//verifica obbligatorieta
		angular.forEach($scope.transient.nuovaFattura.scadenza, function(item){
                   if(item.scadenza === undefined || item.scadenza === null){
					 $scope.flagNext = false;  
				   }
        })

		//verifica totali
		var totaleRighePagamento = 0;		

		angular.forEach($scope.transient.nuovaFattura.scadenza, function(item){
                   totaleRighePagamento= totaleRighePagamento + item.importo; 
        })
		if(totaleRighePagamento != $scope.transient.nuovaFattura.totaleFatturaIvato){
			$scope.flagNext = false;
			toastr.error("I TOTALI SONO CAMBIATI E DIFFERISCONO DAL TOTALE ARTICOLO");
		} 
		
		if($scope.flagNext){
			$('.stepper-custom-latr').attr('style','min-height:70%;other-styles');
			$scope.temp.steppers.selected = 3;
			$scope.temp.steppers.step2.completed = true;
			$scope.temp.steppers.step3.disabled = false;
		} else {
			//mostrare errori a video
		}
				
	};
    */

	$scope.backStep3 = function () {
		$scope.temp.steppers.selected = 2;		
	};

	$scope.calcTotalOnReal = function(){

		var totaleRigheOnReal = 0;		

		angular.forEach($scope.transient.nuovaFattura.scadenza, function(item){
				totaleRigheOnReal= totaleRigheOnReal + item.importo; 
		})
	    return totaleRigheOnReal;
	}
	
	$scope.nextStep3SalvaFattura = function () {	
		
		$scope.flagNext = true;
		$scope.flagDiffZero = true;
		var flagImportoZero = false;

		if($scope.transient.nuovaFattura.core.tipoFattura!=='DDT' && $scope.transient.nuovaFattura.core.tipoFattura!=='PROF'){

			//verifica obbligatorieta
			angular.forEach($scope.transient.nuovaFattura.scadenza, function(item){
				if(item.scadenza === undefined || item.scadenza === null){
					$scope.flagNext = false;  
				}
				if(item.importo === undefined || item.importo === null || item.importo == 0){
					$scope.flagNext = false;					
					flagImportoZero = true;
				}
			})

			//verifica totali
			var totaleRighePagamento = 0;		

			angular.forEach($scope.transient.nuovaFattura.scadenza, function(item){
						totaleRighePagamento= totaleRighePagamento + item.importo; 
			})

			if(totaleRighePagamento.toFixed(2) != $scope.transient.nuovaFattura.totaleFatturaIvato){
				$scope.flagDiffZero = false;
				$scope.flagNext = false;
				toastr.error("I TOTALI SONO CAMBIATI E DIFFERISCONO DAL TOTALE ARTICOLO");
			} 
			if(flagImportoZero){
				toastr.error("NON E' POSSIBILE IMPOSTARE UNA RATA CON IMPORTO PARI A ZERO");
			}
		}

		if($scope.transient.nuovaFattura.core.tipoFattura==='DDT' || $scope.transient.nuovaFattura.core.tipoFattura==='FACC'){

			if(!$scope.transient.nuovaFattura.core.conducente || !$scope.transient.nuovaFattura.core.pesoKg || !$scope.transient.nuovaFattura.core.numColli || !$scope.transient.nuovaFattura.core.trasportoACura){
				$scope.flagNext = false;
			}
		}

		if($scope.flagNext){

			if(($scope.transient.nuovaFattura.core.tipoFattura!=='FACC' && $scope.transient.nuovaFattura.core.tipoFattura!=='DDT' && $scope.transient.nuovaFattura.core.tipoFattura!=='PROF') || ($scope.transient.nuovaFattura.scadenza !==null && $scope.transient.nuovaFattura.scadenza !==undefined && $scope.transient.nuovaFattura.scadenza.length < 3)){
				$('.stepper-custom-latr').attr('style','min-height:110%;other-styles');	
			}else{
				$('.stepper-custom-latr').attr('style','min-height:120%;other-styles');	
			}

			//Gestione allegato
			if($scope.transient.nuovaFattura.allegati!=undefined && $scope.transient.nuovaFattura.allegati!=null && $scope.transient.nuovaFattura.allegati.length > 0){
				angular.forEach($scope.transient.nuovaFattura.allegati, function(allegato){
					allegato["descrizione"] = 'fattura originale';
				});
			}

			switch($scope.transient.nuovaFattura.core.tipoFattura) {
				case "IMME":
				  	$scope.typeFatt = "immediata";
				  	break;
				case "DIFF":
					$scope.typeFatt = "differita";
				  	break;
				case "FACC":
					$scope.typeFatt = "accompagnatoria";
					break;
				case "DDT":
					$scope.typeFatt = "ddt";
					break;
				case "NDCR":
					$scope.typeFatt = "notacredito";
					break;
				case "PROF":
					$scope.typeFatt = "proforma";
					break;
				
				default:
				  $scope.filter = null;
			  }


			//$scope.transient.nuovaFattura.core.dataEmissione = $filter('date')($scope.transient.nuovaFattura.core.dataEmissione, "dd/MM/yyyy"); 
			$scope.transient.nuovaFattura.core.dataScadenza = $filter('date')($scope.transient.nuovaFattura.core.dataScadenza, "dd/MM/yyyy"); 
			FattureService.creaFattura($scope.transient.nuovaFattura, $scope.typeFatt).then(function(response) {  
	
				var handleResponseResult = $scope.handleResponse(response);  
				if(handleResponseResult.next){
					toastr.success($scope.temp.descTipofattura + " creata"); 				
					$scope.temp.steppers.selected = 3;
					$scope.temp.steppers.step2.completed = true;
					$scope.temp.steppers.step3.disabled = false; 
					$scope.transient.nuovaFattura.idFattura = response.data.idFattura;
					$scope.transient.nuovaFattura.numeroFattura = response.data.numeroFattura;
					// Inserire Numero Fattura					
				} else {
					toastr.error("Errore, errore creazione fattura"); 
					console.error("errore creazione fattura");	
				}
			});

		} else {
			if($scope.flagDiffZero && !flagImportoZero){
				toastr.warning("VERIFICARE CHE I DATI SIANO COMPLETI");
			}
		}

	};

	$scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
		//TODO gestire un loader e il success del file caricato
		$scope.spinner.on();

	};

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
			//TODO gestire un loader e il success del file caricato
			console.log("end");
	};


	$scope.errorHandler = function (event, reader, file, fileList, fileObjs, object) {
		console.log("An error occurred while reading file: "+file.name);
		reader.abort();
		toastr.error("Si è verificato un errore sul caricamento del file " + file.name);
	};


	$scope.gotoNuovaFattura = function(){
		//Inserimento fattura con dati cliente prefillati
		$rootScope.clienteModel = $scope.clienteModel;
		$route.reload();
	}

	$scope.openModalPagamentoFatture = function (pIdFattura) {		
		$scope.idFattura = pIdFattura;
		$uibModal.open({
		templateUrl: './html/fatture/modalPagamentoFatture.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: 'PagamentoFattureController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };

	//INIT PAGE

	jQuery.each( $scope.tipoFattureList, function( i, typeFatt ) {
		if(typeFatt.ID === $scope.transient.nuovaFattura.core.tipoFattura){
			$scope.temp.descTipofattura = typeFatt.DESCRIZIONE;
		}
	});

	$scope.getCustomersList();//per typeahead
	$scope.reloadModPag();

	

	$scope.creaPdfFattura = function(p_id,tipoFattura){	
	
		FattureService.creaPdfFattura(p_id).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("pdf creato correttamente");
				var urlTemp = $location.protocol()+":\/\/"+$location.host()+":"+$location.port();
				$window.open(urlTemp+"/pdf/show/"+tipoFattura+"/"+response.data.nomeFile);						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + "" );
			}  	
	    });	
	}


	function popolaSezioneCliente(clienteSelezionato){

		$scope.transient.nuovaFattura.core.idCliente=clienteSelezionato.ID;		
		$scope.transient.nuovaFattura.core.idConto="-1";
		$scope.transient.nuovaFattura.core.modalitaPagamento=clienteSelezionato.ID_MOD_PAGAMENTO?clienteSelezionato.ID_MOD_PAGAMENTO:"-1";
		$scope.transient.nuovaFattura.header.ragSocialeCliente = clienteSelezionato.NOME;
		$scope.transient.nuovaFattura.header.nome = clienteSelezionato.NOME;
		$scope.transient.nuovaFattura.header.indirizzoCliente = clienteSelezionato.INDIRIZZO;
		$scope.transient.nuovaFattura.header.partitaiva=clienteSelezionato.PARTITA_IVA;
		$scope.transient.nuovaFattura.header.codicefiscale=clienteSelezionato.CODICE_FISCALE;
		$scope.transient.nuovaFattura.header.telCliente=clienteSelezionato.TELEFONO;
		$scope.transient.nuovaFattura.header.faxCliente=clienteSelezionato.FAX;

		ClienteService.getContiByIdCliente(clienteSelezionato.ID).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.persistent.elencoConti = response.data.accounts;	 						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
	    });

	}

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
		if(sconto > 0){//TODO CAPIRE se su prezzo scontato oppure no
			return ((prezzo*quantita) - (((prezzo*quantita)/100)*sconto)) * valIva;
		} else {
			return (prezzo*quantita) * valIva;
		}		
	}



	function aggiornaTotaliFattura(){

	//aggiorna totale fattura
		$scope.transient.nuovaFattura.totaleFattura = 0;
		$scope.transient.nuovaFattura.totaleFatturaIvato = 0;
		angular.forEach($scope.transient.nuovaFattura.righe, function(item){
		   $scope.transient.nuovaFattura.totaleFattura = $scope.transient.nuovaFattura.totaleFattura + item.totaleRiga; 
		   var tempFatIvato = $scope.transient.nuovaFattura.totaleFatturaIvato + item.totaleRigaIvato;
		   $scope.transient.nuovaFattura.totaleFatturaIvato = parseFloat(tempFatIvato.toFixed(2)); 

		});

	}

	$scope.generaDdt = function(p_id){	
	
		FattureService.generaDdt(p_id).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				
				toastr.success("DDT Creato correttamente" );
				console.log("ddt creato correttamente");
				$location.url('fatture/modificaFattura/'+response.data.fattura.OUTCOME);							
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - " );
			}  	
	    });	
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


}]);

