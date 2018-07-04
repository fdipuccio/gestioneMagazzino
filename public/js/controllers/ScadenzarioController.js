angular.module("gestionaleApp")
.controller("ScadenzarioController", ['$scope','$uibModal','ScadenzarioService',
 function ($scope, $uibModal, ScadenzarioService) {
	 'use strict';

    $scope.eventsList =[];
    $scope.filter={};	
    $scope.filter.anno = new Date().getFullYear();
    $scope.filter.mese = new Date().getMonth()+1; 
    $scope.filter.utenteTo=$scope.user.ID;
    $scope.defaultDay = new Date();


    //funzione che recupera la lista degli eventi
    $scope.getScadenzarioList = function (){
        //invocazione service recupero scadenzarioList
        ScadenzarioService.readScadenzario($scope.filter).then(function(response) {
            var handleResponseResult = $scope.handleResponse(response);  
            if(handleResponseResult.next){
                angular.forEach(response.data.eventi, function(item){
                    var evento = {};
                    evento.id = item.ID_EVENTO;
                    evento.title = item.DESCRIZIONE;
                    evento.start = item.DATA_INIZIO;
                    evento.end = item.DATA_FINE;
                    evento.color = $scope.formatStyle(item.TIPO_EVENTO);
                    evento.allDay = item.TIPO_EVENTO==="FATTURA"?true:false;
                    $scope.eventsList.push(evento);
                }); 
            } else {
                toastr.error("Errore: "+ handleResponseResult.errorCode + " - GESTIONE ERRORE DA FARE!!!" );
            }    
            renderCalendar($scope.eventsList);
        });
    }

    function renderCalendar(eventsList)
    {
        $('#calendar').fullCalendar({      
          
        	header:
            {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            viewRender: function(view, element) {
                    var res = view.intervalStart.format().split("-");
                    console.log("anno: "+res[0]+" mese: "+res[1]);
                    $scope.filter.anno=res[0];
                    $scope.filter.mese=res[1]; 
                    $scope.getScadenzarioList();   
            },
            defaultDate: $scope.defaultDay,
            lang: 'it',
            buttonIcons: true, // show the prev/next text
            weekNumbers: false,
            editable: true,
            eventLimit: true, // allow "more" link when too many events
            eventStartEditable: false,
            events: eventsList
        });


    }

    $scope.formatStyle = function(typeEvent){

        switch(typeEvent) {
            case "FATTURA":
              return 'orange';
              break;
            case "NOTA":
              return 'red';
              break;
            case "APPUNTAMENTO_CLIENTE":
              return 'green';
              break;
            case "APPUNTAMENTO_FORNITORE":
              return 'aquamarine';
              break;

            default:
              return 'grey';
        }
    } 


    $scope.getScadenzarioList();

}]);

