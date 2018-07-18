angular.module("gestionaleApp")
.controller("ArticoliController",
 ['$scope','$uibModal','filterFilter','$sessionStorage','ArticoliService','CategorieService','CommonService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, filterFilter, $sessionStorage, ArticoliService, CategorieService, CommonService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.persistent.idArticolo = $routeParams.idCliente;

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

	$scope.schedaArticolo = function(idArticolo){
		ArticoliService.getArticoloById(idArticolo).then(function(response) {  
			var handleResponseResult = $scope.handleResponse(response);  
				if(handleResponseResult.next){
					$scope.persistent.articolo = response.data.articolo[0];	
				} else {
					toastr.error("TODO - GESTIONE ERRORE");
				}		    	
		});	
	}

	// END PUBLIC FUNCTIONS

	//init page
	$scope.schedaArticolo();
	//$scope.getCategorieArticoliList();
	
	//private functions
	

}]);
