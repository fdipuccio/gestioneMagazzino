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
		
		var chart = new CanvasJS.Chart("chartArticolo", {
			animationEnabled: true,
			title:{
				text: "Crude Oil Reserves vs Production, 2016"
			},	
			axisY: {
				title: "Billions of Barrels",
				titleFontColor: "#4F81BC",
				lineColor: "#4F81BC",
				labelFontColor: "#4F81BC",
				tickColor: "#4F81BC"
			},
			axisY2: {
				title: "Millions of Barrels/day",
				titleFontColor: "#C0504E",
				lineColor: "#C0504E",
				labelFontColor: "#C0504E",
				tickColor: "#C0504E"
			},	
			toolTip: {
				shared: true
			},
			legend: {
				cursor:"pointer",
				itemclick: toggleDataSeries
			},
			data: [{
				type: "column",
				name: "Proven Oil Reserves (bn)",
				legendText: "Proven Oil Reserves",
				showInLegend: true, 
				dataPoints:[
					{ label: "Saudi", y: 266.21 },
					{ label: "Venezuela", y: 302.25 },
					{ label: "Iran", y: 157.20 },
					{ label: "Iraq", y: 148.77 },
					{ label: "Kuwait", y: 101.50 },
					{ label: "UAE", y: 97.8 }
				]
			},
			{
				type: "column",	
				name: "Oil Production (million/day)",
				legendText: "Oil Production",
				axisYType: "secondary",
				showInLegend: true,
				dataPoints:[
					{ label: "Saudi", y: 10.46 },
					{ label: "Venezuela", y: 2.27 },
					{ label: "Iran", y: 3.99 },
					{ label: "Iraq", y: 4.45 },
					{ label: "Kuwait", y: 2.92 },
					{ label: "UAE", y: 3.1 }
				]
			}]
		});
		chart.render();
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
