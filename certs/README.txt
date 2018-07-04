Per prima cosa generiamo una chiave RSA lunga 4096 bit per la nostra CA radice e la memorizziamo nel file ca.key:
	
	openssl genrsa -out ca.key 4096

Se vuoi proteggere con password questa chiave, aggiungi l'opzione -des3.


nel caso si ricevesse un errore simile a:

	Unable to load config info from C:/OpenSSL/openssl.cnf

va settata la variabile:

	set OPENSSL_CONF=<pathName completo del file openssl.cnf>
	
Successivamente, creiamo il nostro certificato CA self-signed root ca.crt; dovrai fornire un'identità per la root CA

	openssl req -new -x509 -days 1826 -key ca.key -out ca.crt

L'opzione -x509 viene utilizzata per un certificato autofirmato. 1826 giorni ci danno un certificato valido per 5 anni.
Passaggio successivo: creare la CA subordinata che verrà utilizzata per la firma effettiva. Innanzitutto, genera la chiave

	openssl genrsa -out ia.key 4096
	
Quindi, richiedere un certificato per questa CA subordinata:
	
	openssl req -new -key ia.key -out ia.csr
	
Assicurarsi che il Common Name immesso qui sia diverso dal Common Name immesso in precedenza per la CA principale. 
Se sono uguali, si verificherà un errore più avanti durante la creazione del file pkcs12

Passaggio successivo: elaborare la richiesta per il certificato CA subordinato e farlo firmare dalla root CA

	openssl x509 -req -days 730 -in ia.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out ia.crt
	
Il certificato sarà valido per 2 anni (730 giorni) e ho deciso di scegliere il mio numero di serie 01 per questo certificato 
(-set_serial 01). Per la root CA, ho lasciato che OpenSSL generi un numero seriale casuale.


