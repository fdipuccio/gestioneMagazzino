angular.module("gestionaleApp")
.controller("DettaglioArticoloController",
 ['$scope','$uibModal','filterFilter', '$routeParams','$sessionStorage','ArticoliService','CategorieService','CommonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, filterFilter, $routeParams, $sessionStorage, ArticoliService, CategorieService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.persistent = {};
	$scope.persistent.idArticolo = $routeParams.idArticolo;

	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('responsive', true).withLanguageSource('//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json');
	$scope.dtColumnDefs = [          
		DTColumnDefBuilder.newColumnDef(0).withOption('width', '25%'),
		DTColumnDefBuilder.newColumnDef(1).withOption('width', '25%'),
		DTColumnDefBuilder.newColumnDef(2).withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(3).withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(4).withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(5).withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(6).withOption('width', '9%'),
		DTColumnDefBuilder.newColumnDef(7).notSortable().withOption('width', '6%')
	];
	$scope.filters = {};
	$scope.filters.filter = {};
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


	$scope.loadChart = function () {
		
		window.barChart = Morris.Bar({
			element: 'bar-chart-articolo',
			//Mettere dati che arrivano dal servizio
			data: [
				{ month: '10/17', valueAcq: 20, valueCons: 8},
				{ month: '11/17', valueAcq: 10, valueCons: 7},
				{ month: '12/17', valueAcq: 5, valueCons: 2},
				{ month: '01/18', valueAcq: 5, valueCons: 1},
				{ month: '02/18', valueAcq: 20, valueCons: 10},
				{ month: '03/18', valueAcq: 90, valueCons: 45},
				{ month: '04/18', valueAcq: 70, valueCons: 30},
				{ month: '05/18', valueAcq: 80, valueCons: 40},
				{ month: '06/18', valueAcq: 60, valueCons: 29},
				{ month: '07/18', valueAcq: 65, valueCons: 18}
			],
			xkey: 'month',
			ykeys: ['valueAcq', 'valueCons'],
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
	$scope.loadChart();
	//$scope.getCategorieArticoliList();
	
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
