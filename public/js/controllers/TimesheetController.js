angular.module("gestionaleApp")
.controller("TimesheetController",
 ['$scope','$uibModal','filterFilter','$filter','$sessionStorage', 'TimesheetService','CommonService','UserService', 'DTOptionsBuilder', 'DTColumnDefBuilder',
 function ($scope, $uibModal, filterFilter,$filter,$sessionStorage, TimesheetService, CommonService,UserService, DTOptionsBuilder, DTColumnDefBuilder) {
	 'use strict';
	$scope.model ={};	
	$scope.dipendenti = [];		
	$scope.checkData = true;
	$scope.transient = {};	

	$scope.persistent = {};
	$scope.persistent.editTimesheet = {};
	
	$scope.carichi = {};
	$scope.carichi.hours = [];

	$scope.filters = {};
	$scope.filters.filter = {};

	$scope.invalidTotOre = true;

	$scope.selectMonth = $filter('date')(new Date(), "yyyyMM");

	$scope.cancelDialogTimesheet = function () {
		//$uibModalInstance.close(false);
		$uibModalInstance.dismiss('cancel');
	};

	// START PUBLIC FUNCTIONS

	//funzione che recupera la lista di tutti gli utenti
	$scope.getTimesheetList = function (){
		//invocazione service
		$scope.spinner.on();
		TimesheetService.getTimesheetList($scope.user.MATRICOLA, $scope.selectMonth).then(function(response) {  

			var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$scope.timesheet = response.data;

				//Abilitazione range date disponibili in base al mese selezionato
	 			$scope.minDate = moment($scope.timesheet.dates[0].hours[0].iddata, "YYYYMMDD").format("DD/MM/YYYY");
				$scope.maxDate = moment($scope.timesheet.dates[0].hours[$scope.timesheet.dates[0].hours.length - 1].iddata, "YYYYMMDD").format("DD/MM/YYYY");
				 
				 //recupero Task
				TimesheetService.getTaskTS().then(function(responseT) {  
					if(responseT.data!=null && responseT.data!=undefined){
						$scope.tasksList = responseT.data.dates;
					} else {
						toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
					}      	
				});	


	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    	$scope.spinner.off();  	
	    });		
	}

	//open modale di inserimento utente
	$scope.openModalNewTimesheet = function (p_matricola) {
		$scope.checkData = true;
		$scope.carichi = {};
		$scope.carichi.hours = [];
		$scope.transient.newTimesheet = {};
		$scope.transient.newTimesheet.matricola = p_matricola;
			
		$uibModal.open({
		templateUrl: './html/timesheet/modalNewTimesheet.html',
		scope:$scope,
		backdrop:'static',
		size: 'lg',	
		controller: function ($scope, $uibModalInstance) {
			$scope.createNewTimesheetButton = function () {
				createNewTimesheet($uibModalInstance);
			};
			$scope.saveTimesheetButton = function () {
				saveTimesheet($uibModalInstance);
			};
			$scope.cancelNewTimesheetButton = function () {
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
	
	$scope.addTaskToDayTimesheetButton = function () {

		if($scope.transient.newTimesheet.hour.out != undefined && moment($scope.transient.newTimesheet.hour.in, 'HHmmss').toDate().getTime() > moment($scope.transient.newTimesheet.hour.out, 'HHmmss').toDate().getTime()){
			toastr.error("Errore - l'ora fine deve essere successiva a quella di inizio");
			$scope.checkData = false;
		}else{

			var start = $scope.transient.newTimesheet.date +" "+$scope.transient.newTimesheet.hour.in;
			var end  = $scope.transient.newTimesheet.date +" "+$scope.transient.newTimesheet.hour.out;
			var tothours = moment.utc(moment(end,"DD/MM/YYYY HH:mm").diff(moment(start,"DD/MM/YYYY HH:mm"))).format("HH.mm");
			$scope.transient.newTimesheet.hour["totH"] = tothours;
			$scope.transient.newTimesheet.hour["taskCode"] = $filter('filter')($scope.tasksList, {'id': $scope.transient.newTimesheet.hour.task})[0].code;
		
			$scope.totalHours = 0.0;
			$scope.flagErrorHour = false;
			jQuery.each( $scope.carichi.hours, function( i, task ) {
				//TODO da rivedere i controlli non funzionano sempre
				$scope.totalHours += parseFloat(task.totH);
				if(moment($scope.transient.newTimesheet.hour.in, 'HHmmss').toDate().getTime() > moment(task.in, 'HHmmss').toDate().getTime() && moment($scope.transient.newTimesheet.hour.in, 'HHmmss').toDate().getTime() < moment(task.out, 'HHmmss').toDate().getTime()){
					$scope.flagErrorHour = true;
				}
				if(moment($scope.transient.newTimesheet.hour.out, 'HHmmss').toDate().getTime() < moment(task.out, 'HHmmss').toDate().getTime() && moment($scope.transient.newTimesheet.hour.out, 'HHmmss').toDate().getTime() > moment(task.in, 'HHmmss').toDate().getTime()){
					$scope.flagErrorHour = true;
				}
				
			});

			$scope.checkData = false;

			if(!$scope.flagErrorHour){
				$scope.carichi.hours.push($scope.transient.newTimesheet.hour);
				$scope.transient.newTimesheet.hour = {};
					
				//Per il momento tolto controllo che le ore devono essere minimo 8
				/*if($scope.totalHours>=7.60){
					$scope.invalidTotOre = false;
				}*/
				$scope.invalidTotOre = false;
				
			}else{
				toastr.error("Errore - E' già presente un attività nelle ore selezionate");
			}
		}

	};

	$scope.removeTask = function (task) {
		
		jQuery.each( $scope.carichi.hours, function( i, taskItem ) {
			if(taskItem.task === task){
				$scope.totalHours -= parseFloat(taskItem.totH);
				$scope.carichi.hours.splice(i, 1);
				return false;
			}
		});
		//controllo il totale e se ho raggiunto le 8h
		if($scope.totalHours<7.60){
			//Per il momento tolto controllo che le ore devono essere minimo 8
			//$scope.invalidTotOre = true;
		}
	};

	$scope.openModalEditTimesheet = function (p_matricola, iddata) {
		$scope.checkData = true;
		$scope.carichi = {};
		$scope.carichi.hours = [];
		$scope.persistent.editTimesheet = {};
		$scope.persistent.editTimesheet.matricola = p_matricola;
				
		TimesheetService.getTimesheetByDay(p_matricola, iddata).then(function(response) {
	    	if(response.data!=null && response.data!=undefined){
				$scope.persistent.editTimesheet.date = $scope.formatDate(response.data.data.data);
				$scope.persistent.editTimesheet.trasferta = response.data.data.trasferta;
				$scope.carichi.hours = response.data.data.details;
				
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}        	
		});

		$uibModal.open({
		templateUrl: './html/timesheet/modalEditTimesheet.html',
		scope:$scope,
		backdrop:'static',
		size: 'lg',	
		controller: function ($scope, $uibModalInstance) {
			$scope.createNewTimesheetButton = function () {
				createNewTimesheet($uibModalInstance);
			};
			$scope.saveTimesheetButton = function () {
				updateTimesheet($uibModalInstance);
			};
			$scope.cancelNewTimesheetButton = function () {
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
	
	$scope.addTaskToDayEditTimesheetButton = function () {

		if($scope.persistent.editTimesheet.hour.out != undefined && moment($scope.persistent.editTimesheet.hour.in, 'HHmmss').toDate().getTime() > moment($scope.persistent.editTimesheet.hour.out, 'HHmmss').toDate().getTime()){
			toastr.error("Errore - l'ora fine deve essere successiva a quella di inizio");
			$scope.checkData = false;
		}else{

			var start = $scope.persistent.editTimesheet.date +" "+$scope.persistent.editTimesheet.hour.in;
			var end  = $scope.persistent.editTimesheet.date +" "+$scope.persistent.editTimesheet.hour.out;
			var tothours = moment.utc(moment(end,"DD/MM/YYYY HH:mm").diff(moment(start,"DD/MM/YYYY HH:mm"))).format("HH.mm");
			$scope.persistent.editTimesheet.hour["totH"] = tothours;
			$scope.persistent.editTimesheet.hour["taskCode"] = $filter('filter')($scope.tasksList, {'id': $scope.persistent.editTimesheet.hour.task})[0].code;
		
			$scope.totalHours = 0.0;
			$scope.flagErrorHour = false;
			jQuery.each( $scope.carichi.hours, function( i, task ) {
				//TODO da rivedere i controlli non funzionano sempre
				$scope.totalHours += parseFloat(task.totH);
				if(moment($scope.persistent.editTimesheet.hour.in, 'HHmmss').toDate().getTime() > moment(task.in, 'HHmmss').toDate().getTime() && moment($scope.persistent.editTimesheet.hour.in, 'HHmmss').toDate().getTime() < moment(task.out, 'HHmmss').toDate().getTime()){
					$scope.flagErrorHour = true;
				}
				if(moment($scope.persistent.editTimesheet.hour.out, 'HHmmss').toDate().getTime() < moment(task.out, 'HHmmss').toDate().getTime() && moment($scope.persistent.editTimesheet.hour.out, 'HHmmss').toDate().getTime() > moment(task.in, 'HHmmss').toDate().getTime()){
					$scope.flagErrorHour = true;
				}
				
			});

			$scope.checkData = false;

			if(!$scope.flagErrorHour){
				$scope.carichi.hours.push($scope.persistent.editTimesheet.hour);
				$scope.persistent.editTimesheet.hour = {};
					
				//Per il momento tolto controllo che le ore devono essere minimo 8
				/*if($scope.totalHours>=7.60){
					$scope.invalidTotOre = false;
				}*/
				$scope.invalidTotOre = false;
				
			}else{
				toastr.error("Errore - E' già presente un attività nelle ore selezionate");
			}
		}

	};

	$scope.formatDate = function(data){
		var date = new Date(data);
		return date.toLocaleDateString('en-GB')
	}

	// END PUBLIC FUNCTIONS

	//init page
	$scope.getTimesheetList();
	//$scope.getUserList();
	
	//private functions

	function saveTimesheet ($uibModalInstance) {
		//$scope.carichi["date"] = $scope.transient.newTimesheet.date;
		$scope.carichi["trasferta"] = $scope.transient.newTimesheet.trasferta?1:0;
		$scope.transient.newTimesheet.iddata = moment($scope.transient.newTimesheet.date,"DD/MM/YYYY HH:mm").format("YYYYMMDD");
		TimesheetService.createTimesheet($scope.carichi, $scope.transient.newTimesheet.matricola, $scope.transient.newTimesheet.iddata).then(function(response) {  
	    	if(response.data!=null && response.data!=undefined){
				$scope.getTimesheetList();
				$uibModalInstance.dismiss('cancel');
				toastr.success("Attività inserita con successo" );
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}      	
		});	
	};

	function updateTimesheet ($uibModalInstance) {
		//$scope.carichi["date"] = $scope.persistent.editTimesheet.date;
		$scope.carichi["trasferta"] = $scope.persistent.editTimesheet.trasferta?1:0;
		$scope.persistent.editTimesheet.iddata = moment($scope.persistent.editTimesheet.date,"DD/MM/YYYY HH:mm").format("YYYYMMDD");
		TimesheetService.createTimesheet($scope.carichi, $scope.persistent.editTimesheet.matricola, $scope.persistent.editTimesheet.iddata).then(function(response) {  
	    	if(response.data!=null && response.data!=undefined){
				$scope.getTimesheetList();
				$uibModalInstance.dismiss('cancel');
				toastr.success("Attività inserita con successo" );
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}      	
		});	
	};

}]);

