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
    socket.emit('enterChat', user, function(resp) {
        renderUsers(resp);
    });
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Escuchar información
socket.on('createMessage', function(message) {
    renderMessages(message, false);
    scrollBottom();
});

//Cuando un usuario entra y sale del chat
socket.on('peopleList', function(users) {
    renderUsers(users);
});

//Mensajes privados
socket.on('privateMessage', function(message) {
    console.log('Mensaje privado:', message);
});