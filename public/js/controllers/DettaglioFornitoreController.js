angular.module("gestionaleApp")
.controller("DettaglioFornitoreController",
 ['$scope','$uibModal','$location', 'filterFilter','$filter','$rootScope', '$routeParams','$sessionStorage', 'FattureService', 'ArticoliService', 'FornitoreService', 'ClienteService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, $location, filterFilter, $filter, $rootScope, $routeParams,$sessionStorage, FattureService, ArticoliService, FornitoreService, ClienteService, DTOptionsBuilder, DTColumnDefBuilder) {
	'use strict';
	//TODO rimuovere ClienteService
	$scope.temp = {};	
	$scope.transient = {};		
	$scope.persistent = {};
	$scope.persistent.idFornitore = $routeParams.idFornitore;
	$scope.articoli = [];
	
	
	$scope.dtOptionsArticoli = DTOptionsBuilder.newOptions().withOption('responsive', true).withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefsArticoli = [          
		DTColumnDefBuilder.newColumnDef(0).withOption('width', '20%'),
		DTColumnDefBuilder.newColumnDef(1).withOption('width', '20%'),
		DTColumnDefBuilder.newColumnDef(2).withOption('width', '30%'),
		DTColumnDefBuilder.newColumnDef(3).withOption('width', '20%'),		
		DTColumnDefBuilder.newColumnDef(4).notSortable().withOption('width', '10%')
	];

	// START PUBLIC FUNCTIONS
	
	$scope.gotoElencoFornitori = function(){		
		$location.url('/fornitori');
	}
	
	$scope.loadDatiFornitore = function () {    
		FornitoreService.getFornitoreById($scope.persistent.idFornitore).then(function(response) {  
			var handleResponseResult = $scope.handleResponse(response);  
			if(handleResponseResult.next){					
				$scope.fornitoreModel = response.data.supplier;
			}    	
		});	


		FornitoreService.getIndicatoriPerIdFornitore($scope.persistent.idFornitore).then(function(response) {  
	    	if(response!=null && response.statusText == 'OK' && response.data != null){					
				$scope.indicatori = response.data.datiFatture;
				if($scope.indicatori.totale>0){
					$('#chartFornitore').attr('style','height: 200px;');
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


	}
	$scope.getAppuntamenti = function () {
		FornitoreService.getAppuntamentiForn($scope.persistent.idFornitore).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.appuntamenti = response.data.appuntamenti;
				$scope.appuntamenti.counterNotific = $scope.appuntamenti.length;
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode );
			}  
	    });	
	}

	$scope.getArticoliAssociati = function () {
		FornitoreService.getArticoliAssociati($scope.persistent.idFornitore).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				if(response.data.articoli != null){
					$scope.articoli = response.data.articoli;
				} else {
					$scope.articoli = [];
				}
								
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode );
			}  
	    });	
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

		var chart = new CanvasJS.Chart("chartFornitore", {
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
	
	
	$scope.openModalNewAppuntamentoForn = function (p_id) {
		$scope.transient.newAppuntamentoForn = {};
		$scope.transient.newAppuntamentoForn.appuntamento = {};
		$scope.transient.newAppuntamentoForn.appuntamento.idFornitore = p_id;
		$uibModal.open({
		templateUrl: './html/fornitori/modalNewAppuntamentoForn.html',
		scope:$scope,
		backdrop:'static',
		size: 'md',	
		controller: function ($scope, $uibModalInstance) {
			$scope.createNewAppuntamentoFornButton = function () {
				if($scope.transient.newAppuntamentoForn.appuntamento.endDate != undefined && moment($scope.transient.newAppuntamentoForn.appuntamento.startDate, 'DDMMYYYYHHmmss').toDate().getTime() > moment($scope.transient.newAppuntamentoForn.appuntamento.endDate, 'DDMMYYYYHHmmss').toDate().getTime()){
					toastr.error("Errore - la data fine deve essere successiva alla data inizio");	
				}else{
					createNewAppuntamentoForn($uibModalInstance);
				}
				
			};		
			$scope.cancelNewAppuntamentoFornButton = function () {
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

 	 function createNewAppuntamentoForn($uibModalInstance){
		console.log("createNewAppuntamentoForn");
		//adding default values
		FornitoreService.createAppuntamentoForn($scope.persistent.idFornitore, $scope.transient.newAppuntamentoForn).then(function(response) {  
	    	var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("Appuntamento Fornitore creato"); 
				$scope.getAppuntamenti();
				$('.nav-tabs a[href="#tab_1_22"]').trigger('click');
				$uibModalInstance.dismiss('cancel');
	    	} else {
				toastr.error("errore creazione Appuntamento Fornitore");				
			}    	
		});
	}

	$scope.askConfirmationDeleteAppuntamento = function(p_id) {
		var message = "Sei sicuro di voler eliminare questo appuntamento?";
		var modalHtml = '<div class="modal-body">' + message + '</div>';
		modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteAppuntamento()">OK</button><button class="btn btn-warning" ng-click="cancelDelete()">Cancel</button></div>';

		$uibModal.open({
			template: modalHtml,
			scope:$scope,
			backdrop:'static',		
			controller: function ($scope, $uibModalInstance) {
				$scope.confirmDeleteAppuntamento = function () {
					$scope.removeAppuntamento(p_id);
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

	$scope.askConfirmationDeleteAssociazione = function(p_id) {
		var message = "Sei sicuro di voler eliminare questo associazione con l'articolo?";
		var modalHtml = '<div class="modal-body">' + message + '</div>';
		modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="confirmDeleteAssociazione()">OK</button><button class="btn btn-warning" ng-click="cancelDeleteAssociazione()">Cancel</button></div>';

		$uibModal.open({
			template: modalHtml,
			scope:$scope,
			backdrop:'static',		
			controller: function ($scope, $uibModalInstance) {
				$scope.confirmDeleteAssociazione = function () {
					$scope.removeAssociazione(p_id);
					$uibModalInstance.dismiss('cancel');
				};		
				$scope.cancelDeleteAssociazione = function () {
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


	$('.nav-tabs a').click(function (e) {
	    e.preventDefault();
	    $(this).tab('show');
	});

	$scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
	  	//TODO gestire un loader e il success del file caricato
	  	$scope.spinner.on();

	};

	$scope.removeAppuntamento = function (p_id){
		console.log("removeAppuntamento = " + p_id);
		FornitoreService.deleteAppuntamentoForn($scope.persistent.idFornitore, p_id).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("Appuntamento cancellato correttamente"); 
				$scope.getAppuntamenti(); 									
	    	} else {				
				toastr.error("Errore: "+ handleResponseResult.errorCode);
			}
	    	   	
	    });				
	}

	$scope.removeAssociazione = function (p_codiceForn){
		console.log("removeAssociazione = " + p_codiceForn);
		FornitoreService.deleteAssociazioneArticoloForn($scope.persistent.idFornitore, p_codiceForn).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("Associazione articolo cancellata correttamente"); 
				$scope.getArticoliAssociati(); 									
	    	} else {				
				toastr.error("Errore: "+ handleResponseResult.errorCode);
			}
	    	   	
	    });				
	}
	
	$scope.loadDatiFornitore();
	$scope.getAppuntamenti();
	$scope.getArticoliAssociati();	
}]);

