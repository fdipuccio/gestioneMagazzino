angular.module("gestionaleApp")
.controller("HomeController", ['$scope','CommonService','PromemoriaService','$rootScope','AziendaService','FatturatiService','FattureService','$sessionStorage', 
function ($scope,CommonService,PromemoriaService,$rootScope,AziendaService,FatturatiService,FattureService,$sessionStorage) {
   'use strict';

	 $scope.messaggio = "Accedi alle funzionalità tramite il menu sulla sinistra";
     $scope.dataChart = {};
     $scope.dataChart.period = "mesi";
     $scope.testDateTimePicker;//DA RIMUOVERE
     //Init chart default values
	   var init = [{elem: "1", in: 0, out: 0}, {elem: "2", in: 0, out: 0}, {elem: "3", in: 0, out: 0}, {elem: "4", in: 0, out: 0}];
     var msg;
     $rootScope.promemoriaList = [];

    //funzione che recupera la lista dei promemoria
    $scope.getPromemoriaList = function (){
        //invocazione service recupero promemoriaList
        PromemoriaService.getPromemoriaList($scope.user.ID).then(function(response) {

            var handleResponseResult = $scope.handleResponse(response);  
            if(handleResponseResult.next){              
            $rootScope.promemoriaList = [];
                angular.forEach(response.data.note, function(item){
                    if(tempoRimasto(item.EXPIRATION_DATE).giorni >= 0){
                        var nota = {};
                        var dd = tempoRimasto(item.EXPIRATION_DATE).giorni;
                        var hh = tempoRimasto(item.EXPIRATION_DATE).ore;
                        var mm = tempoRimasto(item.EXPIRATION_DATE).minuti;
                        nota.nota = item.NOTA;

                        if(dd == 0){
                          nota.icon = 'fa fa-bolt';
                          nota.label = 'label-danger';
                        }else if(dd > 0 && dd <=2){
                          nota.icon = 'fa fa-bell-o';
                          nota.label = 'label-warning';
                        }else if(dd > 2 && dd <=4){
                          nota.icon = 'fa fa-bullhorn';
                          nota.label = 'label-success';
                        }else if(dd > 4 && dd <=6){
                          nota.icon = 'fa fa-bullhorn';
                          nota.label = 'label-info';
                        }else{
                          nota.icon = 'fa fa-bell-o';
                          nota.label = 'label-default';
                        }

                        nota.deadline = dd>0?(dd>1?dd + ' giorni ':dd + ' giorno '):'' + hh>0?(hh>1?hh + ' ore ':hh + ' ora '):'' + mm>0?mm + ' min ':'scaduto ' + mm.replace("-", "") + ' min fa';
                        $rootScope.promemoriaList.push(nota);
                    }
                }); 
          
            } else {
                toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
            }

        });
    }

    $scope.getScadenzeFM = function (){
      //invocazione service
      FatturatiService.getScadenzeFM().then(function(response) {  
  
          var handleResponseResult = $scope.handleResponse(response);  
          if(handleResponseResult.next){
          $scope.totScadenzeFM = response.data.totale?response.data.totale:0;									
          } else {
          toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
        }
        });		
    }

    $scope.getFattureEmesse = function (){
      //invocazione service
      FatturatiService.getFattureEmesse().then(function(response) {  
  
          var handleResponseResult = $scope.handleResponse(response);  
          if(handleResponseResult.next){
          $scope.totFattureEmesse = response.data.totale?response.data.totale:0;									
          } else {
          toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
        }
        });		
    }

    //funzione che recupera dati per il chart
    $scope.getDataChart = function (filterPeriodo){

        //Init grafico solo la prima volta
        if(window.barChart === undefined){
            //barChart();
        }
        switch(filterPeriodo) {
            case "MESE":
              $scope.dataChart.period = "mesi";
              break;
            case "ANNO":
              $scope.dataChart.period = "anni";
              break;
            case "QUARTER":
              $scope.dataChart.period = "trimestri";
              break;
            
            default:
              $scope.dataChart.period = "mesi";
        }

        //invocazione service recupero dati per il chart
        FatturatiService.getDataChart(filterPeriodo, '4').then(function(response) {
            $("#bar-chart").empty();
            if(response!=null && response.data != null){
                msg = response.data.data;
                  window.barChart = Morris.Bar({
        element: 'bar-chart',
        //Mettere dati che arrivano dal servizio
        data: msg,
        xkey: 'elem',
        ykeys: ['in', 'out'],
        labels: ['Entrate', 'Uscite'],
        lineColors: ['#3598dc','#e7505a'],
        barColors: ['#3598dc','#e7505a'],
        lineWidth: '2px',
        redraw: true, 
        hideHover: 'auto'
      });
                //window.barChart.setData($scope.dataChart.data);
            }       
        });
    }

    $scope.formatDate = function(data){
		var date = new Date(data);
		return date.toLocaleDateString('en-GB')
	}

	//quando atterriamo nella home page, carichiamo alcune liste da mettere in sessione
	$scope.getIvaApplicataList = function (){
		//invocazione service
		CommonService.getIvaApplicataList().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaIvaApplicata = response.data;
	    	}    	
	    });		
	}

	$scope.getPagamentoFattureList = function (){
		//invocazione service
		CommonService.getPagamentoFattureList(false).then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaPagamentoFatture = response.data;
	    	}    	
	    });		
	}

	$scope.getUDMList = function (){
		//invocazione service
		CommonService.getUDMList().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaUDM = response.data;
	    	}    	
	    });		
	}
	$scope.getValuteList = function (){
		//invocazione service
		CommonService.getValuteList().then(function(response) {  
	    	if(response!=null && response.statusText == "OK" && response.data != null){
				$sessionStorage.listaValute = response.data;
	    	}    	
	    });		
	},
	$scope.getContiByAzienda = function (){
		//invocazione service
		AziendaService.getContiByAzienda($scope.labels.idAzienda).then(function(response) {  

            var handleResponseResult = $scope.handleResponse(response);  
	    	if(handleResponseResult.next){
				$sessionStorage.listaContiAzienda = response.data.conti;									
	    	} else {
				toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
			}
	    });		
	}

  $scope.getTipoFattureList = function (){    
    //invocazione service
      
    FattureService.getTipoFattura().then(function(response) {
      var handleResponseResult = $scope.handleResponse(response);  
        if(handleResponseResult.next){
        //$scope.tipoFattureList = response.data.tipofattura;  
        $sessionStorage.tipoFattureList =  response.data.tipoFattura;           
        } else {
        toastr.error("Errore: "+ handleResponseResult.errorCode );
      
      }  
      }); 
  }

  $scope.getPromemoriaList();

	if($sessionStorage.listaIvaApplicata === undefined || $sessionStorage.listaIvaApplicata === null){
		$scope.getIvaApplicataList();	
	}
	if($sessionStorage.listaPagamentoFatture === undefined || $sessionStorage.listaPagamentoFatture === null){
		$scope.getPagamentoFattureList();	
	}
	if($sessionStorage.listaUDM === undefined || $sessionStorage.listaUDM === null){
		$scope.getUDMList();	
	}
	if($sessionStorage.listaValute === undefined || $sessionStorage.listaValute === null){
		$scope.getValuteList();	
	}
	if($sessionStorage.listaContiAzienda === undefined || $sessionStorage.listaContiAzienda === null){
		$scope.getContiByAzienda();	
	}
  if($sessionStorage.tipoFattureList === undefined || $sessionStorage.tipoFattureList === null){
    $scope.getTipoFattureList();
  }

	$("#currentitem0").parent().addClass("start active open");
  
  //INIT PAGE
  $scope.getDataChart("MESE");
  $scope.getScadenzeFM();
  $scope.getFattureEmesse();
  


    function barChart() {
      window.barChart = Morris.Bar({
        element: 'bar-chart',
        //Mettere dati che arrivano dal servizio
        data: msg,
        xkey: 'elem',
        ykeys: ['in', 'out'],
        ymin: -10, // set this value according to your liking
        xmin:-10,
        labels: ['Entrate', 'Uscite'],
        lineColors: ['#3598dc','#e7505a'],
        barColors: ['#3598dc','#e7505a'],
        lineWidth: '2px',
        resize: true,
        redraw: true, 
        hideHover: 'auto'
      });
    }

    function tempoRimasto(tempo){
      let t = Date.parse(tempo) - Date.parse(new Date());
      let sec = Math.floor( (t/1000) % 60 );
      let min = Math.floor( (t/1000/60) % 60 );
      let ore = Math.floor( (t/(1000*60*60)) % 24 );
      let giorni = Math.floor( t/(1000*60*60*24) );
      
      return {
        'totale': t,
        'giorni': giorni,
        'ore': ore,
        'minuti': min,
        'secondi': sec
      };
    }

}]);

