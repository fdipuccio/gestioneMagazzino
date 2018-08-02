angular.module("gestionaleApp")
.controller("DettaglioArticoloController",
 ['$scope','$uibModal','filterFilter', '$routeParams','$sessionStorage','ArticoliService','CategorieService','CommonService', '$filter', 'DTOptionsBuilder', 'DTColumnDefBuilder','$location',
 function ($scope, $uibModal, filterFilter, $routeParams, $sessionStorage, ArticoliService, CategorieService, CommonService, $filter, DTOptionsBuilder, DTColumnDefBuilder, $location) {
	 'use strict';
	$scope.persistent = {};
	$scope.persistent.idArticolo = $routeParams.idArticolo;
	$scope.dataGrah1 = [];
	$scope.dataGrah2 = [];
	$scope.listaQtyScatola = $sessionStorage.listaQtyScatola;
	$scope.listaUdmDiametro = $sessionStorage.listaUdmDiametro;
	$scope.listaUdmLunghezza = $sessionStorage.listaUdmLunghezza;
	$scope.listaCategorie = $sessionStorage.listaCategorie;
	$scope.listaColori = $sessionStorage.listaColori;

	// START PUBLIC FUNCTIONS

	$scope.schedaArticolo = function(){
		ArticoliService.getArticoloById($scope.persistent.idArticolo).then(function(response) {  
			var handleResponseResult = $scope.handleResponse(response);  
				if(handleResponseResult.next){
					$scope.persistent.articolo = response.data.articolo;	
				} else {
					toastr.error("TODO - GESTIONE ERRORE");
				}		    	
		});	
	}

	$scope.updateArticolo = function(){
		ArticoliService.editArticolo($scope.persistent.articolo, $scope.persistent.idArticolo).then(function(response) { 
			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				toastr.success("Articolo aggiornato correttamente");
	    	} else {
				if(handleResponseResult.errorCode == 'ART002'){
					toastr.warning("ARTICOLO GIA PRESENTE");
				} else {
					toastr.error("ERRORE ARTICOLO GENERICO");		
				}
						
			}    	 
		});
	}

	$scope.loadChartAndamento = function (){
		$("#bar-chart-andamento").empty();
		$scope.endDate = $filter('date')(new Date(), "dd/MM/yyyy");
		$scope.mydate = new Date();
		$scope.startDate = $scope.mydate.setDate($scope.mydate.getDate() - 365);
		$scope.startDate = $filter('date')($scope.startDate, "dd/MM/yyyy");

		ArticoliService.getGraphAndamentoArticolo($scope.persistent.idArticolo, $scope.startDate, $scope.endDate).then(function(response) {  
			var handleResponseResult = $scope.handleResponse(response);  
				if(handleResponseResult.next){
					$scope.dataGrah1 = response.data.dati;
					$scope.loadChart1();
				} else {
					toastr.error("TODO - GESTIONE ERRORE");
				}		    	
		});
	}

	$scope.loadChartCarico = function (){
		$("#bar-chart-magazzino").empty();
		ArticoliService.getGraphCaricoScarico($scope.persistent.idArticolo).then(function(response1) {  
			var handleResponseResult = $scope.handleResponse(response1);
				if(handleResponseResult.next){
					$scope.dataGrah2 = response1.data.dati;	
					$scope.loadChart2();
				} else {
					toastr.error("TODO - GESTIONE ERRORE");
				}		    	
		});
	}

	$scope.loadChart1 = function () {
		
		window.barChart = Morris.Line({
			element: 'bar-chart-andamento',
			//Mettere dati che arrivano dal servizio
			data: $scope.dataGrah1,
			xkey: 'data',
			ykeys: ['prezzo'],
			labels: ['prezzo articolo'],
			lineColors: ['#3598dc'],
			barColors: ['#3598dc'],
			lineWidth: '2px',
			redraw: true, 
			hideHover: 'auto'
		});
	}

	$scope.loadChart2 = function () {
		window.barChart = Morris.Bar({
			element: 'bar-chart-magazzino',
			//Mettere dati che arrivano dal servizio
			data: $scope.dataGrah2,
			xkey: 'meseanno',
			ykeys: ['carico', 'scarico'],
			labels: ['acquisti', 'consumi'],
			lineColors: ['#3598dc','#e7505a'],
			barColors: ['#3598dc','#e7505a'],
			lineWidth: '2px',
			redraw: true, 
			hideHover: 'auto'
		});

	}

	$scope.gotoElencoArticoli = function(){
		$location.url("/articoli"); 
	}


	// END PUBLIC FUNCTIONS

	//init page
	$scope.schedaArticolo();
	//$scope.loadDataForCharts();
	
	//private functions
	
	$('.nav-tabs a').click(function (e) {
	    e.preventDefault();
	    $(this).tab('show');
	});

	function toggleDataSeries(e) {
		if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		chart.render();
	}

	

}]);
