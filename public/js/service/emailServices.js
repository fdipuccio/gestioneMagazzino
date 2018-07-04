angular.module("gestionaleApp").factory('MailService', function($http) {
        return {
            
            reminderPagamentoFattura : function(pIdFattura){
            var pBody = {};
            //TODO a ervizio adeguato lasciare solo idFattura
            pBody.nomecliente = "fabriziodipiu";
            pBody.mailcliente = "fairirer@gmail.com";
            pBody.numerofattura = "12334";
            pBody.nometemplate = "template_payment_reminder.txt";
            pBody.idFattura = pIdFattura;
            
            var tempUrl = '/mail/sendReminder';                	
            	
            	 return $http({
               	  method: 'POST',
                  url: tempUrl,
                  data:  pBody     	  
               });
            	
            }

        }
    });