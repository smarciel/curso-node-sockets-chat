const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {
    console.log('Usuario conectado');

    client.on('enterChat', (user, callback) => {
        console.log(user, 'conectado');

        if (!user.name || !user.room) {
            return callback({
                error: true,
                mensaje: 'El nombre y/o la sala es necesario.'
            });
        }

        client.join(user.room);

        users.addPerson(client.id, user.name, user.room);

        client.broadcast.to(user.room).emit('peopleList', users.getPeopleByRoom(user.room));

        callback(users.getPeopleByRoom(user.room));
    });

    client.on('createMessage', (data) => {
        let user = users.getPerson(client.id);
        let message = createMessage(user.name, data.message);
        client.broadcast.to(user.room).emit('createMessage', message);
    });

    client.on('privateMessage', data => {
        let user = users.getPerson(client.id);
        client.broadcast.to(data.to).emit('privateMessage', createMessage(user.name, data.message));
    })

    client.on('disconnect', () => {
        let userRemoved = users.removePerson(client.id);
        if (userRemoved) {
            client.broadcast.to(userRemoved.room).emit('createMessage', createMessage('Administrador', `${userRemoved.name} abandonó el chat.`));
        }
        client.broadcast.to(userRemoved.room).emit('peopleList', users.getPeopleByRoom(userRemoved.room));
    });

});