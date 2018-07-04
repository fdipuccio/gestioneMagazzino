angular.module("gestionaleApp")
.controller("ModificaFatturaController",
 ['$scope','$uibModal','filterFilter','$location','$window','$rootScope','$timeout','$routeParams','$sessionStorage','ClienteService', 'ArticoliService','CommonService', 'FattureService', '$filter', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, filterFilter, $location,$window,$rootScope, $timeout, $routeParams, $sessionStorage, ClienteService, ArticoliService, CommonService, FattureService, $filter, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};			
	$scope.temp = {};
	$scope.temp.campoDiRicercaCliente;
	$scope.temp.campoDiRicercaArticolo;
	$scope.temp.ricercaAvanzata = {};
	$scope.temp.ricercaAvanzata.codiceArticolo;
	$scope.temp.ricercaAvanzata.descrizione;
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
	$scope.transient.modificaFattura = {};
	$scope.transient.modificaFattura.core = {};
	$scope.transient.modificaFattura.header = {};	
	$scope.transient.modificaFattura.righe = [];	
	$scope.transient.modificaFattura.totaleFattura = 0;
	$scope.transient.modificaFattura.totaleFatturaIvato = 0;
	$scope.transient.modificaFattura.scadenza = [];
	$scope.persistent = {};
	$scope.persistent.clienteSelezionato = {};
	$scope.persistent.articoliRicercaAvanzata = [];
	$scope.persistent.elencoConti = [];
	$scope.sezioneRichiamante = "modificaFattura";
	$scope.labelSfoglia = "Seleziona file";

	$scope.persistent.idFattura = $routeParams.idFattura;
	$scope.transient.modificaFattura.header.id = $scope.persistent.idFattura;
	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;
	$scope.tipoFattureList = $sessionStorage.tipoFattureList;
	$scope.listaPagamentoFatture = [];
    //un flag per ogni caricamento
	$scope.verificaCaricamento = [
		{"loading":false},//testata
		{"loading":false},//core
		{"loading":false},//fatture
		{"loading":false},//scadenze
		{"loading":false}//clienti
	];

	$scope.filtRange = {};
	
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
		$rootScope.tipoFatturaCod = $scope.transient.modificaFattura.core.tipoFattura;
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
		$scope.transient.modificaFattura.core.idCliente="";
		$scope.transient.modificaFattura.core.modalitaPagamento="-1";
		$scope.transient.modificaFattura.core.tipoFattura = "";
		$scope.transient.modificaFattura.header.nome = "nomeCliente";
		$scope.transient.modificaFattura.header.ragSocialeCliente ="ragSociaeCliente";
		$scope.transient.modificaFattura.header.indirizzoCliente = "indirizzoCliente";
		$scope.transient.modificaFattura.header.emailCliente = "emailCliente";
		$scope.transient.modificaFattura.header.telCliente = "11";
		$scope.transient.modificaFattura.header.faxCliente = "222";
		$scope.transient.modificaFattura.header.citta = "222";
		$scope.transient.modificaFattura.header.provincia = "222";
		$scope.transient.modificaFattura.header.cap = "222";
		$scope.transient.modificaFattura.header.rifCliente = "rifCliente";
		$scope.transient.modificaFattura.header.ibanCliente = "ibanCliente";
		$scope.transient.modificaFattura.header.label = "label";
		$scope.transient.modificaFattura.header.ragSocialeMM = "ragSocialeMM";
		$scope.transient.modificaFattura.header.indirizzoMM = "indirizzoMM";
		$scope.transient.modificaFattura.header.emailMM = "emailMM";
		$scope.transient.modificaFattura.header.telMM = 111;
		$scope.transient.modificaFattura.header.faxMM = 1111;
		$scope.transient.modificaFattura.header.rifMM = "rifMM";
		$scope.transient.modificaFattura.header.ibanMM = "ibanMM"; 
	}
	
	$scope.resetCliente = function (){
		$scope.temp.campoDiRicercaCliente= "";
		$scope.transient.modificaFattura.core = {};
		$scope.transient.modificaFattura.header = {};
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

			var articoloGiaPresente = $filter('filter')($scope.transient.modificaFattura.righe,			
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
					
							ArticoliService.getArticoloByCodice($scope.transient.modificaFattura.core.idCliente,$scope.temp.campoDiRicercaArticolo,'IMME').then(function(response) {  
								var handleResponseResult = $scope.handleResponse(response);  
								if(handleResponseResult && handleResponseResult.next){									
									var articoloRicercato = response.data.articolo[0];
										if(articoloRicercato!=undefined && articoloRicercato!=null){
										$scope.temp.campoDiRicercaArticolo = "";																			
										// NON CAMBIARE ORDINE
										var nuovoArticolo = {};
										nuovoArticolo.qty = 1;
										nuovoArticolo.codiceArticolo = articoloRicercato.CODICE_ARTICOLO;
										nuovoArticolo.idArticolo = articoloRicercato.ID_ARTICOLO;
										nuovoArticolo.descrizione = articoloRicercato.DESCRIZIONE;
										nuovoArticolo.prezzoUnitario = articoloRicercato.PREZZO;
										nuovoArticolo.sconto = 0;
										nuovoArticolo.iva = articoloRicercato.IVA;
										nuovoArticolo.totaleRiga = calcolaTotaleSenzaIva(articoloRicercato.PREZZO,nuovoArticolo.qty,0);
										nuovoArticolo.totaleRigaIvato = calcolaTotaleConIva(articoloRicercato.PREZZO,nuovoArticolo.qty,0,articoloRicercato.IVA);	
										nuovoArticolo.codiceArticolo = articoloRicercato.CODICE_ARTICOLO;	
										nuovoArticolo.editable = false;
										$scope.transient.modificaFattura.righe.push(nuovoArticolo);
										aggiornaTotaliFattura();
									} else {
										toastr.warning("nessun articolo con questo codice");
									}		
										
								} else {
									toastr.error(handleResponseResult.errorCode + " - errore ricerca articolo"); 
									console.error("errore ricerca articolo");				
								}    	
							});
					
					}	

		}
			
	}
	

$scope.aggiungiArticoloManuale = function (){
				
		var articoloGiaPresente = $filter('filter')($scope.transient.modificaFattura.righe, {'descrizione': $scope.temp.campoDiRicercaArticolo});
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
						
						$scope.transient.modificaFattura.righe.push(nuovoArticolo);
						$scope.temp.campoDiRicercaArticolo = "";
						aggiornaTotaliFattura();
				
				}		
	}

	//open modale di inserimento articolo
	$scope.openModalRicercaArticolo = function () {
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

		$uibModal.open({
		templateUrl: './html/fatture/modalRicercaArticoli.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: function ($scope, $uibModalInstance) {
			$scope.aggiungiArticoloDaRicercaAvanzata = function (articolo) {			
				$scope.spinner.on();
				var articoloGiaPresente = $filter('filter')($scope.transient.modificaFattura.righe, {'idArticolo': articolo.ID_ARTICOLO});
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
					$scope.transient.modificaFattura.righe.push(nuovoArticolo);
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

	  //open modale di cambio cliente
	$scope.openModalCambiaCliente = function () {
		$scope.temp.campoDiRicercaCliente = "";
		$uibModal.open({
		templateUrl: './html/fatture/cambiaClienteModificaFattura.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: function ($scope, $uibModalInstance) {
			$scope.salvaCambiaUtenteButton = function (cliente) {			
			};		
			$scope.cancelCambiaUtenteButton = function () {
				//$uibModalInstance.close(false);
				$uibModalInstance.dismiss('cancel');
			};
			$scope.onSelectClient = function ($item, $model, $label) {
				//match con la lista clienti precedentemente caricata dal servizio ricerca clienti
				$scope.clienteModel = $filter("filter")($scope.customersList, {ID: $item.ID})[0];
				popolaSezioneCliente($scope.clienteModel, false, true);
				$uibModalInstance.dismiss('cancel');		
			};
		}
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	 };

	 $scope.eseguiRicercaAvanzata = function (event){
		var filterObj = {};		
		filterObj.code=$scope.temp.ricercaAvanzata.codiceArticolo;
		filterObj.descrizione = $scope.temp.ricercaAvanzata.descrizione;
		filterObj.idCliente = $scope.transient.modificaFattura.core.idCliente;

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
		var currentRow = $scope.transient.modificaFattura.righe[indexValue];		
		if(currentRow!=undefined && currentRow!=null){
			currentRow.totaleRiga = calcolaTotaleSenzaIva(currentRow.prezzoUnitario,currentRow.qty,currentRow.sconto);
			currentRow.totaleRigaIvato = calcolaTotaleConIva(currentRow.prezzoUnitario,currentRow.qty,currentRow.sconto, currentRow.iva);
		}
		aggiornaTotaliFattura();
	}

	$scope.eliminaArticoloDaFattura = function (indexValue){
		$scope.transient.modificaFattura.righe.splice(indexValue, 1);	
		aggiornaTotaliFattura();
	}

	

	// END PUBLIC FUNCTIONS
		

	//Gestione Typeahead
	//funzione che recupera la lista dei clienti
	$scope.getCustomersList = function (){

		//invocazione service
		ClienteService.getClientiList().then(function(response) { 
			
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.customersList = response.data.customers;	 
				//Popolo lista typeahead
				jQuery.each( $scope.customersList, function( i, customer ) {
					$scope.clientTypeaheadItem = {'ID' : customer.ID, 'DESCRIZIONE' : customer.NOME + (customer.PARTITA_IVA?' - ' + customer.PARTITA_IVA:'') + (customer.CODICE_FISCALE?' - ' + customer.CODICE_FISCALE:'')};
					$scope.clientTypeaheadList.push($scope.clientTypeaheadItem);
				});
				$scope.verificaCaricamento[4].loading = true;
				verificaCaricamentoCompleto();
			}else {
				toastr.error("errore modifica fattura - codice = " + handleResponseResult.errorCode); 
				
			}
	    	  	
	    });		
	}


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
		if($scope.transient.modificaFattura.core.modalitaPagamento=="-1" && $scope.transient.modificaFattura.core.tipoFattura!=='DDT' && $scope.transient.modificaFattura.core.tipoFattura!=='PROF'){
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
		
		if($scope.transient.modificaFattura.righe.length > 0 ){
			$scope.checkDatiCompleti = true;
			angular.forEach($scope.transient.modificaFattura.righe, function(item){
				if( item.descrizione === null || item.descrizione === '' || item.qty === null || item.qty === 0) {
					$scope.checkDatiCompleti = false;
				}
				if((item.prezzoUnitario === null || item.prezzoUnitario === 0  || item.prezzoUnitario === undefined || 
					
					item.iva === null || item.iva === undefined || item.iva === 0 ||
					item.totaleRiga === null || item.totaleRiga === undefined || item.totaleRiga < 0
					) && ($scope.transient.modificaFattura.core.tipoFattura!=='DDT')){
					$scope.checkDatiCompleti = false;
				}
			});

			if($scope.checkDatiCompleti){
				if($scope.transient.modificaFattura.core.tipoFattura!=='DDT' && $scope.transient.modificaFattura.core.tipoFattura!=='PROF'){

					if($scope.transient.modificaFattura.core.modalitaPagamento !==	$scope.persistent.modalitaPagamento){

						$scope.transient.modificaFattura.scadenza = [];
						$scope.spinner.on();
						FattureService.getPagamentoFattura($scope.transient.modificaFattura.core.modalitaPagamento,
												$scope.transient.modificaFattura.totaleFatturaIvato).then(function(response) {
															
							if(response!=null && response.data != null && response.statusText == 'OK'){
								
								angular.forEach(response.data, function(item){
								var objScadenza = {};	
								objScadenza.importo = item.ammontare;
								objScadenza.label = item.terminiDiPagamento;
								objScadenza.scadenza = item.scadenza;
								objScadenza.stato = "BOZZA";
								$scope.transient.modificaFattura.scadenza.push(objScadenza);
								})
								
								$scope.spinner.off();
							} 
							
						});

					}
					//Logica se la tabella delle rate supera 3 righe
				
					if($scope.transient.modificaFattura.core.tipoFattura==='FACC'){
						$('.stepper-custom-latr').attr('style','min-height:100%;other-styles');	
					}else if(($scope.transient.modificaFattura.core.tipoFattura==='FACC') || ($scope.transient.modificaFattura.scadenza !==null && $scope.transient.modificaFattura.scadenza !==undefined && $scope.transient.modificaFattura.scadenza.length < 3)){
						$('.stepper-custom-latr').attr('style','min-height:85%;other-styles');	
					}else if($scope.transient.modificaFattura.core.tipoFattura!=='FACC' && $scope.transient.modificaFattura.scadenza !==null && $scope.transient.modificaFattura.scadenza !==undefined && $scope.transient.modificaFattura.scadenza.length < 4){
						$('.stepper-custom-latr').attr('style','min-height:90%;other-styles');	
					}else if($scope.transient.modificaFattura.core.tipoFattura!=='FACC' && $scope.transient.modificaFattura.scadenza !==null && $scope.transient.modificaFattura.scadenza !==undefined && $scope.transient.modificaFattura.scadenza.length < 5){
						$('.stepper-custom-latr').attr('style','min-height:95%;other-styles');	
					}else{
						$('.stepper-custom-latr').attr('style','min-height:100%;other-styles');	
					}
						
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
		 var flagNext = true;

		//verifica obbligatorieta
		angular.forEach($scope.transient.modificaFattura.scadenza, function(item){
                   if(item.scadenza === undefined || item.scadenza === null){
					 flagNext = false;  
				   }
        })

		//verifica totali
		var totaleRighePagamento = 0;		

		angular.forEach($scope.transient.modificaFattura.scadenza, function(item){
                   totaleRighePagamento= totaleRighePagamento + item.importo; 
        })
		if(totaleRighePagamento != $scope.transient.modificaFattura.totaleFatturaIvato){
			flagNext = false;
			toastr.warning("I TOTALI SONO CAMBIATI E DIFFERISCONO DAL TOTALE ARTICOLO - TODO -> GESTIRE IN HTML");
		} 
		
		if(flagNext){
			$scope.temp.steppers.selected = 2;
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

		angular.forEach($scope.transient.modificaFattura.scadenza, function(item){
				totaleRigheOnReal= totaleRigheOnReal + item.importo; 
		})
	    return totaleRigheOnReal;
	}
	
	$scope.nextStep3AggiornaFattura = function () {	
		
		$scope.flagNext = true;
		$scope.flagDiffZero = true;
		var flagImportoZero = false; 
		if($scope.transient.modificaFattura.core.tipoFattura!=='DDT' && $scope.transient.modificaFattura.core.tipoFattura!=='PROF'){

			//verifica obbligatorieta
			angular.forEach($scope.transient.modificaFattura.scadenza, function(item){
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

			angular.forEach($scope.transient.modificaFattura.scadenza, function(item){
						totaleRighePagamento= totaleRighePagamento + item.importo; 
			})
			if(totaleRighePagamento != $scope.transient.modificaFattura.totaleFatturaIvato){
				$scope.flagDiffZero = false;
				$scope.flagNext = false;
				toastr.error("I TOTALI SONO CAMBIATI E DIFFERISCONO DAL TOTALE ARTICOLO");
			} 
			if(flagImportoZero){
				toastr.error("NON E' POSSIBILE IMPOSTARE UNA RATA CON IMPORTO PARI A ZERO");
			}
		}
		
		if($scope.transient.modificaFattura.core.tipoFattura==='DDT' || $scope.transient.modificaFattura.core.tipoFattura==='FACC'){
			
			if(!$scope.transient.modificaFattura.core.conducente || !$scope.transient.modificaFattura.core.pesoKg || !$scope.transient.modificaFattura.core.numColli || !$scope.transient.modificaFattura.core.trasportoACura){
				$scope.flagNext = false;
			}
		}


		if($scope.flagNext) {


			if(($scope.transient.modificaFattura.core.tipoFattura!=='FACC' && $scope.transient.modificaFattura.core.tipoFattura!=='DDT' && $scope.transient.modificaFattura.core.tipoFattura!=='PROF') || ($scope.transient.modificaFattura.scadenza !==null && $scope.transient.modificaFattura.scadenza !==undefined && $scope.transient.modificaFattura.scadenza.length < 3)){
				$('.stepper-custom-latr').attr('style','min-height:110%;other-styles');	
			}else{
				$('.stepper-custom-latr').attr('style','min-height:120%;other-styles');	
			}

			//Gestione allegato
			if($scope.transient.modificaFattura.allegati!=undefined && $scope.transient.modificaFattura.allegati!=null && $scope.transient.modificaFattura.allegati.length > 0){
				angular.forEach($scope.transient.modificaFattura.allegati, function(allegato){
					allegato["descrizione"] = 'fattura originale';
				});
			}

			$scope.transient.modificaFattura.core.dataEmissione = $filter('date')($scope.transient.modificaFattura.core.dataEmissione, "dd/MM/yyyy"); 
			$scope.transient.modificaFattura.core.dataScadenza = $filter('date')($scope.transient.modificaFattura.core.dataScadenza, "dd/MM/yyyy"); 
		
		angular.forEach($scope.transient.modificaFattura.scadenza, function(item){
			item.scadenza = $filter('date')(item.scadenza, "dd/MM/yyyy"); 
		});

		switch($scope.transient.modificaFattura.core.tipoFattura) {
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

		FattureService.updateFattura($scope.transient.modificaFattura, $scope.typeFatt).then(function(response) {  
			
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success($scope.temp.descTipofattura + " modificata");
				$scope.temp.steppers.selected = 3;
				$scope.temp.steppers.step2.completed = true;
				$scope.temp.steppers.step3.disabled = false; 
			}else {
				toastr.error("errore modifica fattura - codice = " + handleResponseResult.errorCode); 
			}
						   	
		});

		} else {
			if($scope.flagDiffZero && !flagImportoZero){
				toastr.warning("VERIFICARE CHE I DATI SIANO COMPLETI");
			}
		}
		
		
	};

	$scope.loadDatiFattura = function () {

		//testata
		FattureService.getFatturaTestataById($scope.persistent.idFattura).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){				
			//$scope.transient.modificaFattura.header.ragSocialeCliente = response.data.testataFattura.CLI_RAGIONE_SOCIALE;
			$scope.transient.modificaFattura.header.nome = response.data.testataFattura.CLI_RAGIONE_SOCIALE;//TODO esite nome o va tolto?
			$scope.transient.modificaFattura.header.indirizzoCliente = response.data.testataFattura.CLI_INDIRIZZO;	
			if(response.data.testataFattura.CLI_IDCONTO != null){
				$scope.transient.modificaFattura.core.idConto = ''+response.data.testataFattura.CLI_IDCONTO;	
			} else {
				$scope.transient.modificaFattura.core.idConto = "-1";
			}
			
			$scope.verificaCaricamento[0].loading = true;
			verificaCaricamentoCompleto();
		} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}  
		});

		//core
		FattureService.getFatturaCoreById($scope.persistent.idFattura).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.transient.modificaFattura.core.numero = response.data.fattura.NUMERO;
				$scope.transient.modificaFattura.core.annoRif = response.data.fattura.ANNO_RIF;
				$scope.transient.modificaFattura.core.stato = response.data.fattura.STATO;
				$scope.transient.modificaFattura.core.statoDescrizione = response.data.fattura.DESCRIZIONE_STATO;
				$scope.transient.modificaFattura.core.idCliente = response.data.fattura.ID_CLIENTE;	
				$scope.transient.modificaFattura.core.tipoFattura = response.data.fattura.TIPO_FATTURA;	
				$scope.transient.modificaFattura.core.trasportoACura = response.data.fattura.TRASPORTO_A_CURA;	
				$scope.transient.modificaFattura.core.numColli = response.data.fattura.NUM_COLLI;	
				$scope.transient.modificaFattura.core.pesoKg = response.data.fattura.PESO_KG;	
				$scope.transient.modificaFattura.core.conducente = response.data.fattura.CONDUCENTE;	
				$scope.transient.modificaFattura.core.noteTrasporto = response.data.fattura.NOTE_TRASPORTO;	

				//gestione get allegati
				if(response.data.fattura.allegati != undefined && response.data.fattura.allegati !=null && response.data.fattura.allegati.length>0){
					$scope.transient.modificaFattura.allegati = angular.copy(response.data.fattura.allegati);
					
					$scope.labelSfoglia = "Cambia";
					$("span.filename-edit").html("<i class='fa fa-file'></i>&nbsp;&nbsp;"+response.data.fattura.allegati[0].filename);
					

				}

				getContiByCliente(response.data.fattura.ID_CLIENTE);				
				$scope.transient.modificaFattura.core.note = response.data.fattura.NOTE;				
				$scope.transient.modificaFattura.core.modalitaPagamento = response.data.fattura.ID_MOD_PAGAMENTO?''+response.data.fattura.ID_MOD_PAGAMENTO:null;
				$scope.persistent.modalitaPagamento = response.data.fattura.ID_MOD_PAGAMENTO?response.data.fattura.ID_MOD_PAGAMENTO:null;
				$scope.transient.modificaFattura.core.dataEmissione = $filter('date')(response.data.fattura.DATA_EMISSIONE, "dd/MM/yyyy");
				$scope.minDateScad = $scope.transient.modificaFattura.core.dataEmissione;
				$scope.transient.modificaFattura.core.dataScadenza = $filter('date')(response.data.fattura.DATA_SCADENZA, "dd/MM/yyyy"); 
				$scope.transient.modificaFattura.core.idProgetto = response.data.fattura.ID_PROGETTO;
				//recupero dati cliente
				ClienteService.getClienteById(response.data.fattura.ID_CLIENTE).then(function(response) {  
					var handleResponseResult = $scope.handleResponse(response);  
					if(handleResponseResult.next){
						$scope.clienteModel=response.data.customer;
						popolaSezioneCliente($scope.clienteModel, false, false);	
						$scope.verificaCaricamento[1].loading = true;
						verificaCaricamentoCompleto();
					} else {
						toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
					}    	
	    		});
				
				$scope.filtRange.tipofattura = $scope.transient.modificaFattura.core.tipoFattura;
				$scope.filtRange.numero = $scope.transient.modificaFattura.core.numero;
				$scope.filtRange.anno = $scope.transient.modificaFattura.core.annoRif;
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
				
				jQuery.each( $scope.tipoFattureList, function( i, typeFatt ) {
					if(typeFatt.ID === $scope.transient.modificaFattura.core.tipoFattura){
						$scope.temp.descTipofattura = typeFatt.DESCRIZIONE;
					}
				});
				$scope.colTypeDoc = "col-md-5";
				if($scope.transient.modificaFattura.core.tipoFattura === "DDT"){
					$scope.temp.labelThirdStep = "Condizioni trasporto";
					$scope.colTypeDoc = "col-md-7";
				}else if($scope.transient.modificaFattura.core.tipoFattura === "FACC"){
					$scope.temp.labelThirdStep = "Condizioni trasporto, pagamenti e note";
				}else if($scope.transient.modificaFattura.core.tipoFattura === "PROF"){
					$scope.temp.labelThirdStep = "Note";
					$scope.colTypeDoc = "col-md-7";
				}else{
					$scope.temp.labelThirdStep = "Pagamenti e note";
				}
			
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
				riga.idArticolo = item.ID_ARTICOLO;
				riga.descrizione = item.DESCRIZIONE;
				riga.qty = item.QTY;
				riga.prezzoUnitario = item.PREZZO_UNITARIO;
				riga.sconto = item.SCONTO;
				riga.iva = item.CODICE_IVA;
				riga.totaleRiga = calcolaTotaleSenzaIva(item.PREZZO_UNITARIO,item.QTY,item.SCONTO);
				riga.codiceArticolo = item.CODICE_ARTICOLO;
				riga.totaleRigaIvato = calcolaTotaleConIva(riga.prezzoUnitario,riga.qty,riga.sconto,riga.iva);
				$scope.transient.modificaFattura.righe.push(riga);
			});	
			aggiornaTotaliFattura();
			$scope.verificaCaricamento[2].loading = true;
			verificaCaricamentoCompleto();
			
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
				scadObj.scadenza = $filter('date')(item.DATA_SCADENZA, "dd/MM/yyyy");				
				scadObj.stato = item.STATO;				
				$scope.transient.modificaFattura.scadenza.push(scadObj);
			});
			$scope.verificaCaricamento[3].loading = true;
			verificaCaricamentoCompleto();
			
			} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}  
		});		

	}
	
	$scope.reloadModPag = function (clearModPagamento){
		//invocazione service
		if(clearModPagamento){
			$scope.transient.modificaFattura.core.modalitaPagamento="-1";
		}
		$scope.flagConto = $scope.transient.modificaFattura.core.idConto!="-1" && $scope.transient.modificaFattura.core.idConto!= undefined?true:false;
		CommonService.getPagamentoFattureList($scope.flagConto).then(function(response) {  
			//var handleResponseResult = $scope.handleResponse(response);  
    		//if(handleResponseResult.next){
			if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaPagamentoFatture = response.data;
				$scope.listaPagamentoFatture  = response.data;
			} else {
			toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
		}     	
		});		
	}


	//INIT PAGE
	$scope.spinner.on();
	$scope.getCustomersList();//per typeahead	
	$scope.loadDatiFattura();	

	function getContiByCliente(pIdCliente){			
		ClienteService.getContiByIdCliente(pIdCliente).then(function(response) {	
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.persistent.elencoConti = response.data.accounts;	
				$scope.reloadModPag(false);				 						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}
	
	
	function popolaSezioneCliente(clienteSelezionato, isNuovoCLiente, isChangeCliente){
		
		$scope.transient.modificaFattura.header.indirizzoCliente=clienteSelezionato.INDIRIZZO;
		$scope.transient.modificaFattura.header.nome=clienteSelezionato.NOME;
		$scope.transient.modificaFattura.header.partitaiva=clienteSelezionato.PARTITA_IVA;
		$scope.transient.modificaFattura.header.codicefiscale=clienteSelezionato.CODICE_FISCALE;
		$scope.transient.modificaFattura.header.telCliente=clienteSelezionato.TELEFONO;
		$scope.transient.modificaFattura.header.faxCliente=clienteSelezionato.FAX;
		$scope.transient.modificaFattura.header.citta=clienteSelezionato.CITTA;
		$scope.transient.modificaFattura.header.provincia=clienteSelezionato.PROVINCIA;
		$scope.transient.modificaFattura.header.cap=clienteSelezionato.CAP;
		if(!$scope.transient.modificaFattura.core.modalitaPagamento || isChangeCliente){
			$scope.transient.modificaFattura.core.modalitaPagamento=clienteSelezionato.ID_MOD_PAGAMENTO?""+clienteSelezionato.ID_MOD_PAGAMENTO:"-1";
		}
	
		$scope.transient.modificaFattura.core.idCliente=clienteSelezionato.ID;
		if(isNuovoCLiente){
			$scope.transient.modificaFattura.core.idConto="-1";
		}
		$scope.clienteModel = clienteSelezionato;						
		getContiByCliente(clienteSelezionato.ID);

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
		if(sconto > 0){//TODO CAPIRE se su prezzo socntato oppure no
			return ((prezzo*quantita) - (((prezzo*quantita)/100)*sconto)) * valIva;
		} else {
			return (prezzo*quantita) * valIva;
		}		
	}



	function aggiornaTotaliFattura(){

		//aggiorna totale fattura
		$scope.transient.modificaFattura.totaleFattura = 0;
		$scope.transient.modificaFattura.totaleFatturaIvato = 0;
		angular.forEach($scope.transient.modificaFattura.righe, function(item){
			$scope.transient.modificaFattura.totaleFattura = $scope.transient.modificaFattura.totaleFattura + item.totaleRiga; 
			var tempFatIvato = $scope.transient.modificaFattura.totaleFatturaIvato + item.totaleRigaIvato; 
			$scope.transient.modificaFattura.totaleFatturaIvato=parseFloat(tempFatIvato.toFixed(2)); 

		});

		}

	function verificaCaricamentoCompleto(){
		var res = true;
		angular.forEach($scope.verificaCaricamento, function(item){
			if(item.loading == false){
				res = false;
			}			
		});	
		if(res){
			$scope.spinner.off();
		}
	}


	

	$scope.generaDdt = function(p_id){	
	
		FattureService.generaDdt(p_id).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$location.url('fatture/modificaFattura/'+response.data.fattura.OUTCOME);
				toastr.success("DDT Creato correttamente" );
				console.log("ddt creato correttamente");								
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

	$scope.gotoNuovaFattura = function(tipoFattura){
		//Inserimento fattura con dati cliente prefillati
		$rootScope.clienteModel = $scope.clienteModel;
		$location.url('fatture/inserisciFattura/'+tipoFattura);
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

}]);

