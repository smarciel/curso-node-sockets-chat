var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
}

//escuchar
socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterChat', user, function(resp) {
        console.log('Usuarios conectados', resp);
    });
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Enviar información
// socket.emit('createMessage', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('createMessage', function(mensaje) {
    console.log('Servidor:', mensaje);
});

//Cuando un usuario entra y sale del chat
socket.on('peopleList', function(users) {
    console.log('Usuarios conectados:', users);
});

//Mensajes privados
socket.on('privateMessage', function(message) {
    console.log('Mensaje privado:', message);
});