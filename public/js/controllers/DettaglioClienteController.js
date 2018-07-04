angular.module("gestionaleApp")
.controller("DettaglioClienteController",
 ['$scope','$uibModal','$window','$location', 'filterFilter','$filter','$rootScope', '$routeParams','$sessionStorage', 'FattureService', 'ArticoliService', 'ClienteService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal,$window, $location, filterFilter, $filter, $rootScope, $routeParams,$sessionStorage, FattureService, ArticoliService, ClienteService, DTOptionsBuilder, DTColumnDefBuilder) {
	'use strict';

	$scope.temp = {};
	$scope.temp.campoDiRicercaArticolo;
	$scope.temp.ricercaAvanzata = {};
	$scope.temp.ricercaAvanzata.codiceArticolo;
	$scope.temp.ricercaAvanzata.descrizione;
	$scope.labelSfoglia = "Seleziona file";
	$scope.transient = {};
	$scope.transient.nuovoContratto = {};
	$scope.transient.nuovoContratto.contractStart = $filter('date')(new Date(), "dd/MM/yyyy");
	$scope.transient.nuovoContratto.contractDetails = [];
	$scope.persistent = {};
	$scope.persistent.idCliente = $routeParams.idCliente;
	
	$scope.listaIvaApplicata = $sessionStorage.listaIvaApplicata;
	$scope.frequencyList = ['MENSILE','BIMESTRALE','TRIMESTRALE','QUADRIMESTRALE','SEMESTRALE','ANNUALE'];
	$scope.contratti = [];


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
		DTColumnDefBuilder.newColumnDef(4).notSortable().withOption('width', '12%'),
		DTColumnDefBuilder.newColumnDef(5).notSortable().withOption('width', '3%')
	];

	//tabella articoli ricerca avanzata
	$scope.dtOptions_ArticoloRicercaAvanzata = DTOptionsBuilder.newOptions().withOption('responsive', true).withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs_ArticoloRicercaAvanzata = [          
		DTColumnDefBuilder.newColumnDef(2).notSortable()
	];


	// START PUBLIC FUNCTIONS
	
	$scope.gotoElencoClienti = function(){		
		$location.url('/clienti');
	}
	
	$scope.loadDatiCliente = function () {	    
		
		ClienteService.getClienteById($scope.persistent.idCliente).then(function(response) {  
	    	if(response!=null && response.statusText == 'OK' && response.data != null){					
				$scope.clienteModel = response.data.customer;
	    	}    	
	    });	

		FattureService.getFattureByClienteId($scope.persistent.idCliente).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.fatture = response.data.scadenze;
				$scope.fatture.counterNotific = $scope.fatture.length;
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode );
			}  
	    });	

	    ClienteService.getIndicatoriPerIdCliente($scope.persistent.idCliente).then(function(response) {  
	    	if(response!=null && response.statusText == 'OK' && response.data != null){					
				$scope.indicatori = response.data.datiFatture;
				if($scope.indicatori.totale>0){
					$('#chartCliente').attr('style','height: 200px;');
					$scope.dataChart = [];
					if($scope.indicatori.totFatturePagate>0){
						$scope.dataChartItem = {'y' : $scope.indicatori.percFatturePagate, 'label' : "Pagate " + $scope.indicatori.totFatturePagate + " €"};
						$scope.dataChart.push($scope.dataChartItem);
					}
					if($scope.indicatori.totFattureDaPagare>0){
						$scope.dataChartItem = {'y' : $scope.indicatori.percFattureDaPagare, 'label' : "Da pagare " + $scope.indicatori.totFattureDaPagare + " €"};
						$scope.dataChart.push($scope.dataChartItem);
					}
					if($scope.indicatori.totFattureScadute>0){
						$scope.dataChartItem = {'y' : $scope.indicatori.percFattureScadute, 'label' : "Scadute " + $scope.indicatori.totFattureScadute + " €"};
						$scope.dataChart.push($scope.dataChartItem);
					}

					$scope.loadChart();
				}
	    	}    	
	    });	

	    $scope.getAppuntamenti();
		$scope.getElencoConti();
		$scope.getElencoIndirizzi();
	    $scope.getElencoContratti();
	}


	$scope.getAppuntamenti = function () {
		ClienteService.getAppuntamentiCli($scope.persistent.idCliente).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.appuntamenti = response.data.appuntamenti;
				$scope.appuntamenti.counterNotific = $scope.appuntamenti.length;
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode );
			}  
	    });	
	}

	$scope.getElencoConti = function(){		
		ClienteService.getContiByIdCliente($scope.persistent.idCliente).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.conti = response.data.accounts;
				$scope.conti.counterNotific = $scope.conti.length;						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}

	$scope.getElencoIndirizzi = function(){		
		ClienteService.getIndirizziByIdCliente($scope.persistent.idCliente).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.indirizzi = response.data.indirizzo;
				$scope.indirizzi.counterNotific = $scope.indirizzi.length;						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}

	$scope.getElencoContratti = function(){		
		ClienteService.getElencoContratti($scope.persistent.idCliente).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.contratti = response.data.contracts;
				$scope.contratti.counterNotific = $scope.contratti.length;						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}

	$scope.aggiungiArticolo = function (form){
		//TODO effettuare la ricerca by codice articolo e popolare dinamicamente.
		//	   se articolo già presente in articoli, visualizzare popup e invitare a modificare la quantità
		if($scope.temp.campoDiRicercaArticolo==='' || $scope.temp.campoDiRicercaArticolo===undefined){
			toastr.warning("Inserire un codice articolo prima di cliccare su aggiungi");
		}else{
			var contractDet;
			//var esc=escapeHtml($scope.temp.campoDiRicercaArticolo);
			if(form==='new'){
				contractDet = angular.copy($scope.transient.nuovoContratto.contractDetails);
			}else{
				contractDet = angular.copy($scope.persistent.modificaContratto.contractDetails);
			}
			
			var articoloGiaPresente = $filter('filter')(contractDet,
				function(obj) {
        			return obj.codiceArticolo.trim().toUpperCase() === $scope.temp.campoDiRicercaArticolo.trim().toUpperCase();
    			});	 
			if(articoloGiaPresente !== null && articoloGiaPresente !== undefined 
				&& articoloGiaPresente.length > 0){
					toastr.warning("Articolo gia presente in contratto");
			} else {
			
					ArticoliService.getArticoloByCodice($scope.persistent.idCliente,$scope.temp.campoDiRicercaArticolo,'IMME').then(function(response) {  
						
						var handleResponseResult = $scope.handleResponse(response);  
						if(handleResponseResult && handleResponseResult.next){							
								var articoloRicercato = response.data.articolo[0];
								if(articoloRicercato!=null && articoloRicercato!=undefined){
									$scope.temp.campoDiRicercaArticolo = "";
									// NON CAMBIARE ORDINE
									var nuovoArticolo = {};
									nuovoArticolo.qty = 1;
									nuovoArticolo.articoloId = articoloRicercato.ID_ARTICOLO;
									nuovoArticolo.descArticolo = articoloRicercato.DESCRIZIONE;
									nuovoArticolo.articoloPrice = articoloRicercato.PREZZO;
									nuovoArticolo.sconto = 0;
									nuovoArticolo.articoloIva = articoloRicercato.CODICE_IVA;
									//nuovoArticolo.totaleRiga = calcolaTotaleSenzaIva(articoloRicercato.PREZZO,nuovoArticolo.qty,0);
									//nuovoArticolo.totaleRigaIvato = calcolaTotaleConIva(articoloRicercato.PREZZO,nuovoArticolo.qty,0,articoloRicercato.IVA);	
									nuovoArticolo.codiceArticolo = articoloRicercato.CODICE_ARTICOLO;	
									if(form==='new'){
										$scope.transient.nuovoContratto.contractDetails.push(nuovoArticolo);
									}else{
										$scope.persistent.modificaContratto.contractDetails.push(nuovoArticolo);	
									}							
									

									//aggiornaTotaliFattura();
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

	

$scope.aggiungiArticoloManuale = function (form){
				
		var articoloGiaPresente = $filter('filter')($scope.transient.nuovoContratto.contractDetails, {'descrizione': $scope.temp.campoDiRicercaArticolo});
				if(articoloGiaPresente !== null && articoloGiaPresente !== undefined 
					&& articoloGiaPresente.length > 0){
						toastr.warning("Articolo gia presente in contratto");
				} else {
										
						var nuovoArticolo = {};
						nuovoArticolo.qty = 1;
						nuovoArticolo.articoloId = null;
						nuovoArticolo.descArticolo = $scope.temp.campoDiRicercaArticolo;
						nuovoArticolo.articoloPrice = 0;
						nuovoArticolo.sconto = 0;
						nuovoArticolo.articoloIva = 0;
						nuovoArticolo.codiceArticolo = null;	
						
						if(form==='new'){
							$scope.transient.nuovoContratto.contractDetails.push(nuovoArticolo);
						}else{
							$scope.persistent.modificaContratto.contractDetails.push(nuovoArticolo);
						}
						$scope.temp.campoDiRicercaArticolo = "";				
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
				var articoloGiaPresente = $filter('filter')($scope.transient.nuovoContratto.contractDetails, {'idArticolo': articolo.ID_ARTICOLO});
				if(articoloGiaPresente !== null && articoloGiaPresente !== undefined 
					&& articoloGiaPresente.length > 0){
						$scope.spinner.off();
						toastr.warning("Articolo gia presente in fattura");
				} else {
					// NON CAMBIARE ORDINE
					var nuovoArticolo = {};
					nuovoArticolo.qty = 1;
					nuovoArticolo.articoloId = articolo.ID_ARTICOLO;
					nuovoArticolo.descArticolo = articolo.DESCRIZIONE;
					nuovoArticolo.articoloPrice = articolo.PREZZO;
					nuovoArticolo.sconto = 0;
					nuovoArticolo.articoloIva = articolo.CODICE_IVA;
					//nuovoArticolo.totaleRiga = calcolaTotaleSenzaIva(articolo.PREZZO,nuovoArticolo.qty,nuovoArticolo.sconto);
					//nuovoArticolo.totaleRigaIvato = calcolaTotaleConIva(articolo.PREZZO,nuovoArticolo.qty,nuovoArticolo.sconto,articolo.IVA);	     
					nuovoArticolo.codiceArticolo = articolo.CODICE_ARTICOLO; 
					$scope.transient.nuovoContratto.contractDetails.push(nuovoArticolo);
					//aggiornaTotaliFattura();
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
		filterObj.idCliente = $scope.persistent.idCliente;

		ArticoliService.getArticoliByRicercaAvanzata(filterObj,null,null).then(function(response) { 
			
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.persistent.articoliRicercaAvanzata = response.data.articoli;	
			} else {
				toastr.error("Errore: "+ response.data.errMessage + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	 	
		});

	 }


	$scope.eliminaArticoloDaContratto = function (indexValue){
		$scope.transient.nuovoContratto.contractDetails.splice(indexValue, 1);	
	}

	$scope.addArtNew = function(event) {
		if(event.keyCode == 13) {
			$scope.aggiungiArticolo('new');
		}
	}

	$scope.addArtEdit = function(event) {
		if(event.keyCode == 13) {
			$scope.aggiungiArticolo('edit');
		}
	}

	$('#formContract').on('keyup keypress', function(e) {
	  var keyCode = e.keyCode || e.which;
	  if (keyCode === 13) { 
	    e.preventDefault();
	    return false;
	  }
	});

	$('#formEditContract').on('keyup keypress', function(e) {
	  var keyCode = e.keyCode || e.which;
	  if (keyCode === 13) { 
	    e.preventDefault();
	    return false;
	  }
	});

	// END PUBLIC FUNCTIONS

	//init page	

	$scope.loadChart = function () {

		var chart = new CanvasJS.Chart("chartCliente", {
			animationEnabled: true,
			title:{
				text: "",
				horizontalAlign: "left"
			},
			data: [{
				type: "doughnut",
				startAngle: 60,
				//innerRadius: 60,
				indexLabelFontSize: 13,
				indexLabel: "{label} - #percent%",
				toolTipContent: "<b>{label}:</b> (#percent%)",
				dataPoints: $scope.dataChart
			}]
		});
		chart.render();
	}

	$scope.gotoNuovaFattura = function(){
		//Inserimento fattura con dati cliente prefillati
		$rootScope.clienteModel = $scope.clienteModel;
		$location.url('fatture/inserisciFattura/IMME');
	}

	$scope.gotoNuovoContratto = function(){
		//Inserimento contratto con dati cliente prefillati
		$('.nav-tabs a[href="#tab_1_44"]').trigger('click');
		$('#tableContract').hide();
		$('.hideForContract').hide();
		$('#formEditContract').hide();
		$('#formViewContract').hide();
		$('#formContract').show();
		
	}

	$scope.openModalNewAppuntamentoCli = function (p_id) {
		$scope.transient.newAppuntamentoCli = {};
		$scope.transient.newAppuntamentoCli.appuntamento = {};
		$scope.transient.newAppuntamentoCli.appuntamento.idCliente = p_id;
		$uibModal.open({
		templateUrl: './html/clienti/modalNewAppuntamentoCli.html',
		scope:$scope,
		backdrop:'static',
		size: 'md',	
		controller: function ($scope, $uibModalInstance) {
			$scope.createNewAppuntamentoCliButton = function () {
				if($scope.transient.newAppuntamentoCli.appuntamento.endDate != undefined && moment($scope.transient.newAppuntamentoCli.appuntamento.startDate, 'DDMMYYYYHHmmss').toDate().getTime() > moment($scope.transient.newAppuntamentoCli.appuntamento.endDate, 'DDMMYYYYHHmmss').toDate().getTime()){
					toastr.error("Errore - la data fine deve essere successiva alla data inizio");	
				}else{
					createNewAppuntamentoCli($uibModalInstance);
				}
				
			};		
			$scope.cancelNewAppuntamentoCliButton = function () {
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
	  
	  $scope.creaPdfContratto = function(idContratto,idCliente){	

		ClienteService.creaPdfContratto(idContratto,idCliente).then(function(response) {
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				console.log("pdf creato correttamente");
				var urlTemp = $location.protocol()+":\/\/"+$location.host()+":"+$location.port();
				$window.open(urlTemp+"/pdf/show/MAN/"+response.data.nomeFile);						
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + "" );
			}  	
		});	
	}

 	 function createNewAppuntamentoCli($uibModalInstance){
		console.log("createNewAppuntamentoCli");
		//adding default values
		ClienteService.createAppuntamentoCli($scope.persistent.idCliente, $scope.transient.newAppuntamentoCli).then(function(response) {  
	    	if(response!=null && response.data != null && response.data.status =='OK'){
				toastr.success("Appuntamento Cliente creato"); 
				$scope.getAppuntamenti();
				$('.nav-tabs a[href="#tab_1_22"]').trigger('click');
				$uibModalInstance.dismiss('cancel');
	    	} else {
				toastr.error("errore creazione Appuntamento Cliente");				
			}    	
		});
	}

	$scope.openModalAddConti = function (p_id, p_nome) {
		$scope.idClienteSelezionato = p_id;
		$scope.nomeClienteSelezionato = p_nome;
		$scope.transient.nuovoConto = {};
		$uibModal.open({
		templateUrl: './html/clienti/modalEditConti.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: 'ClienteContiController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
 	};

	$scope.openModalAddIndirizzo = function (p_id, p_nome) {
		
		$scope.idClienteSelezionato = p_id;
		$scope.nomeClienteSelezionato = p_nome;
		$scope.transient.nuovoIndirizzo = {};
		$uibModal.open({
		templateUrl: './html/clienti/modalAddIndirizziCliente.html',
		scope:$scope,	
		backdrop:'static',
		size: 'lg',	
		controller: 'ClienteIndirizziController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
	 };
	 
	 $scope.openModalEditIndirizzo = function (p_idIndirizzo, p_idCliente, p_nome) {
		
		$scope.idClienteSelezionato = p_idCliente;
		$scope.nomeClienteSelezionato = p_nome;
		$scope.idIndirizzo = p_idIndirizzo;

		ClienteService.getIndirizzoClienteById(p_idCliente, p_idIndirizzo).then(function(response) {
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.persistent.modificaIndirizzo = {};
				$scope.persistent.modificaIndirizzo.citta = response.data.indirizzo.CITTA;
				$scope.persistent.modificaIndirizzo.cap = response.data.indirizzo.CAP;	
				$scope.persistent.modificaIndirizzo.provincia = response.data.indirizzo.PROVINCIA;
				$scope.persistent.modificaIndirizzo.indirizzo = response.data.indirizzo.INDIRIZZO;
				$scope.persistent.modificaIndirizzo.noteExtra = response.data.indirizzo.NOTE_EXTRA_INDIRIZZO;
				$uibModal.open({
				templateUrl: './html/clienti/modalEditIndirizziCliente.html',
				scope:$scope,	
				backdrop:'static',
				size: 'lg',	
				controller: 'ClienteIndirizziController'
				}).result.catch(function(res) {
					if (!(res === 'cancel' || res === 'escape key press')) {
						throw res;
					}
				});

	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});

		
	 };

	 $scope.askConfirmationDeleteIndirizzo = function(p_idCliente, p_idIndirizzo) {
		var message = "Sei sicuro di voler eliminare questo indirizzo?";
		var modalHtml = '<div class="modal-body">' + message + '</div>';
		modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteIndirizzoCliente()">OK</button><button class="btn btn-warning" ng-click="cancelDeleteIndirizzo()">Cancel</button></div>';
	
		$scope.idClienteSelezionato = p_idCliente;
		$scope.idIndirizzo = p_idIndirizzo;

		$uibModal.open({
			template: modalHtml,
			scope:$scope,	
			backdrop:'static',	
			controller: 'ClienteIndirizziController'
		}).result.catch(function(res) {
			if (!(res === 'cancel' || res === 'escape key press')) {
				throw res;
			}
		});
	};
	
	$('.nav-tabs a').click(function (e) {
	    e.preventDefault();
	    $(this).tab('show');
	});

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


	$scope.salvaContratto = function(){

		if(moment($scope.transient.nuovoContratto.contractStart, 'DDMMYYYYHHmmss').toDate().getTime() > moment($scope.transient.nuovoContratto.contractEnd, 'DDMMYYYYHHmmss').toDate().getTime()){
			toastr.error("Errore - la data fine contratto deve essere successiva alla data inizio");	
		}else{
			ClienteService.salvaContrattoCliente($scope.persistent.idCliente, $scope.transient.nuovoContratto).then(function(response) {  
		    	if(response!=null && response.data != null && response.data.status =='OK'){
					toastr.success("Contratto Cliente creato"); 
					$scope.getElencoContratti();
					$('#tableContract').show();
					$('.hideForContract').show();
					$('#formContract').hide();
					$('#formEditContract').hide();
					$('#formViewContract').hide();
		    	} else {
					toastr.error("errore creazione Contratto Cliente");				
				}    	
			});
		}
		
	}

	$scope.annullaContratto = function(){

		$scope.transient.nuovoContratto = {};
		$scope.transient.visualizzaContratto = {};
		$scope.transient.nuovoContratto.contractStart = $filter('date')(new Date(), "dd/MM/yyyy");
		$scope.transient.visualizzaContratto.contractDetails = [];
		$('.remove-attach').trigger('click');
		$scope.transient.nuovoContratto.contractDetails = [];
		$('#tableContract').show();
		$('.hideForContract').show();
		$('#formContract').hide();
		$('#formEditContract').hide();
		$('#formViewContract').hide();
	}

	$scope.modificaContratto = function(c_id){

		ClienteService.getContrattoClienteById($scope.persistent.idCliente, c_id).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.persistent.modificaContratto = response.data.contratto;
				if($scope.persistent.modificaContratto.contractDetails ==undefined || $scope.persistent.modificaContratto.contractDetails==null){
					$scope.persistent.modificaContratto.contractDetails = [];
				}
				if($scope.persistent.modificaContratto.attach && $scope.persistent.modificaContratto.attach.filename){
					$scope.labelSfoglia = "Cambia";
					$("span.filename-edit").html("<i class='fa fa-file'></i>&nbsp;&nbsp;"+$scope.persistent.modificaContratto.attach.filename);
				}
				//Modifica contratto con dati prefillati
				$('.nav-tabs a[href="#tab_1_44"]').trigger('click');
				$('#tableContract').hide();
				$('.hideForContract').hide();
				$('#formEditContract').show();
				$('#formContract').hide();
				$('#formViewContract').hide();

	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}

	$scope.aggiornaContratto = function(){

		if(moment($scope.persistent.modificaContratto.contractStart, 'DDMMYYYYHHmmss').toDate().getTime() > moment($scope.persistent.modificaContratto.contractEnd, 'DDMMYYYYHHmmss').toDate().getTime()){
			toastr.error("Errore - la data fine contratto deve essere successiva alla data inizio");	
		}else{
			ClienteService.aggiornaContrattoCliente($scope.persistent.idCliente, $scope.persistent.modificaContratto, $scope.persistent.modificaContratto.contractId).then(function(response) {  
		    	if(response!=null && response.data != null && response.data.status =='OK'){
					toastr.success("Contratto Cliente aggiornato"); 
					$scope.getElencoContratti();
					$('#tableContract').show();
					$('.hideForContract').show();
					$('#formContract').hide();
					$('#formEditContract').hide();
					$('#formViewContract').hide();
		    	} else {
					toastr.error("errore creazione Contratto Cliente");				
				}    	
			});
		}
		
	}
	
	$scope.annullaModificaContratto = function(){

		$scope.persistent.modificaContratto = {};
		$scope.persistent.modificaContratto.contractStart = $filter('date')(new Date(), "dd/MM/yyyy");
		$('.remove-attach').trigger('click');
		$scope.persistent.modificaContratto.contractDetails = [];
		$('#tableContract').show();
		$('.hideForContract').show();
		$('#formContract').hide();
		$('#formViewContract').hide();
		$('#formEditContract').hide();
	}	


	$scope.visualizzaContratto = function(c_id){

		ClienteService.getContrattoClienteById($scope.persistent.idCliente, c_id).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.persistent.visualizzaContratto = response.data.contratto;

				if($scope.persistent.visualizzaContratto.contractDetails.length>0){
					//Recupero codice e descrizione dell'iva dalla lista in sessione
					jQuery.each( $scope.persistent.visualizzaContratto.contractDetails, function( i, riga ) {
						$scope.ivaObj = $filter("filter")($sessionStorage.listaIvaApplicata, {VALORE: riga.articoloIva})[0];
						riga["articoloCodIva"] = $scope.ivaObj.CODICE;
						riga["articoloDescIva"] = $scope.ivaObj.DESCRIZIONE;
					});	
				}
				
				//Modifica contratto con dati prefillati
				$('.nav-tabs a[href="#tab_1_44"]').trigger('click');
				$('#tableContract').hide();
				$('.hideForContract').hide();
				$('#formEditContract').hide();
				$('#formViewContract').show();
				$('#formContract').hide();

	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}    	
		});
	}


	$scope.loadDatiCliente();
	
	
}]);

