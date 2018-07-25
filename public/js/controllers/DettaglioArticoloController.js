angular.module("gestionaleApp")
.controller("DettaglioArticoloController",
 ['$scope','$uibModal','filterFilter', '$routeParams','$sessionStorage','ArticoliService','CategorieService','CommonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, filterFilter, $routeParams, $sessionStorage, ArticoliService, CategorieService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.persistent = {};
	$scope.persistent.idArticolo = $routeParams.idArticolo;

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

	$scope.loadDataForCharts = function (){
		$scope.dataGrah1 = [];
		$scope.dataGrah2 = [];
		ArticoliService.getGraphAndamentoArticolo($scope.persistent.idArticolo).then(function(response) {  
			var handleResponseResult = $scope.handleResponse(response);  
				if(handleResponseResult.next){
					$scope.dataGrah1 = response.dati;	
				} else {
					toastr.error("TODO - GESTIONE ERRORE");
				}		    	
		});

		ArticoliService.getGraphCaricoScarico($scope.persistent.idArticolo).then(function(response1) {  
			var handleResponseResult = $scope.handleResponse(response1);
				if(handleResponseResult.next){
					$scope.dataGrah2 = response1.dati;	
				} else {
					toastr.error("TODO - GESTIONE ERRORE");
				}		    	
		});

		$scope.loadChart();
	}

	$scope.loadChart = function () {
		
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



	// END PUBLIC FUNCTIONS

	//init page
	$scope.schedaArticolo();
	$scope.loadDataForCharts();
	
	//private functions
	
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
