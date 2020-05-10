//Funciones para renderizar usuarios
var params = new URLSearchParams(window.location.search);
var name = params.get('name');
var room = params.get('room');

//referencias de jQuery
var divUsers = $('#divUsers');
var formSend = $('#formSend');
var textMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');

function renderUsers(users) {
    console.log(users);

    var html = '';
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('room') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < users.length; i++) {
        html += '<li>';
        html += '    <a data-id="' + users[i].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + users[i].name + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsers.html(html);
}

function renderMessages(message, me) {
    var html = '';
    var date = new Date(message.date);
    var time = date.getHours() + ':' + date.getMinutes();

    var adminClass = 'info';

    if (message.name === 'Administrador') {
        adminClass = 'danger';
    }

    if (me) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + message.name + '</h5>';
        html += '        <div class="box bg-light-inverse">' + message.message + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + time + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if (message.name !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>' + message.name + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + message.message + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + time + '</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//Listeners
divUsers.on('click', 'a', function() {
    var id = $(this).data('id');
    if (id) {
        console.log(id);
    }
});

formSend.on('submit', function(e) {
    e.preventDefault();

    if (textMessage.val().trim().length === 0) {
        return;
    }

    socket.emit('createMessage', {
        user: name,
        message: textMessage.val()
    }, function(message) {
        textMessage.val('').focus();
        renderMessages(message, true);
        scrollBottom();
    });
})