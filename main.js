$(document).ready(function() {

    var connection;
    var connectionTrue = $('#contentConnectionT');
    var connectionFase = $('#contentConnectionF');
    var btnRequesService = $('#btnRequesService');
    var btnRequesExit = $('#btnRequesExit');
    var connectionCurrent = $('#connectionCurrent')[0];
    var idSolicitudServicio = $('#idSolicitudServicio')[0];
    var idTipoServicio = $('#idTipoServicio')[0];
    var establishment = $('#establishment')[0];
    var id_usuario_cognito = $('#id_usuario_cognito')[0];

    connection = new WebSocket('wss://avvvkojx4c.execute-api.us-east-1.amazonaws.com/dev/');

    connection.onopen = function(event) {
        console.log('Conectado');
        connectionFase.css('display', 'none');
        connectionTrue.css('display', 'block');
        btnRequesService.css('display', 'block');

    };

    connection.onerror = function(error) {

        console.log('WebSocket Error ' + error);

    };
    connection.onmessage = function(e) {
        var data = JSON.parse(e.data);
        switch (data.statusCode) {
            case '003':
                btnRequesService.css('display', 'none');
                btnRequesExit.css('display', 'block');

                var dataServiceUpdate = {
                    "id_cliente_cognito": id_usuario_cognito.value,
                    "id_establecimiento": establishment.value,
                    "id_estatus_servicio": 2,
                    "id_tipo_servicio": idTipoServicio.value,
                    "id_solicitud_servicio": data.idSolicitudServicio
                }
                $.ajax({
                    "async": true,
                    "url": "https://n2cbyezsdj.execute-api.us-east-1.amazonaws.com/prod/service/establishment/insertServiceEstablishment/",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                        "charset": "utf-8",
                    },
                    "data": JSON.stringify(dataServiceUpdate)
                });
                var limit = 0;
                var interval = setInterval(function() {
                    if (limit >= 30) {

                        clearInterval(interval);

                    } else {
                        var d = new Date();
                        var t = d.toLocaleTimeString();
                        $('#conteo').val(t);
                        limit++;
                    }

                }, 500);

                break;
            case '004':
                var dataServiceUpdate = {
                    "id_cliente_cognito": id_usuario_cognito.value,
                    "id_establecimiento": establishment.value,
                    "id_estatus_servicio": 3,
                    "id_tipo_servicio": idTipoServicio.value,
                    "id_solicitud_servicio": data.idSolicitudServicio
                }
                $.ajax({
                    "async": true,
                    "url": "https://n2cbyezsdj.execute-api.us-east-1.amazonaws.com/prod/service/establishment/insertServiceEstablishment/",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                        "charset": "utf-8",
                    },
                    "data": JSON.stringify(dataServiceUpdate)
                });
                break;
            case '006':

                btnRequesService.css('display', 'block');
                btnRequesExit.css('display', 'none');
                $('#conteo').val('');
                connectionCurrent.value = '';
                idSolicitudServicio.value = '';

                var dataServiceUpdate = {
                    "id_cliente_cognito": id_usuario_cognito.value,
                    "id_establecimiento": establishment.value,
                    "id_estatus_servicio": 5,
                    "id_tipo_servicio": idTipoServicio.value,
                    "id_solicitud_servicio": data.idSolicitudServicio
                }
                $.ajax({
                    "async": true,
                    "url": "https://n2cbyezsdj.execute-api.us-east-1.amazonaws.com/prod/service/establishment/insertServiceEstablishment/",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                        "charset": "utf-8",
                    },
                    "data": JSON.stringify(dataServiceUpdate)
                });
                break;
        }

    };
    $('#btnRequesService').on('click', function() {

        var dataService = {
            "id_cliente_cognito": id_usuario_cognito.value,
            "id_establecimiento": establishment.value,
            "id_estatus_servicio": 1,
            "id_tipo_servicio": idTipoServicio.value,
            "id_solicitud_servicio": 0
        }
        $.ajax({
            "async": true,
            "url": "https://n2cbyezsdj.execute-api.us-east-1.amazonaws.com/prod/service/establishment/insertServiceEstablishment/",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "charset": "utf-8",
            },
            "data": JSON.stringify(dataService)
        });

        var ConexionEstablishmentAsync = '';
        var msg = { "action": "requestService", "message": "Se solicita el servicio al establecimiento", "statusCode": "001", "idConnectionEstablishment": connectionCurrent.value, "idSolicitudServicio": idSolicitudServicio.value };
        connection.send(JSON.stringify(msg));

    });

    $('#btnRequesExit').on('click', function() {
        var msg = { "action": "requestServiceExit", "message": "Se solicita la salida del establecimiento", "statusCode": "005", "idConnectionEstablishment": connectionCurrent.value, "idSolicitudServicio": idSolicitudServicio.value };
        connection.send(JSON.stringify(msg));
    });

});