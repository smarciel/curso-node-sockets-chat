class User {

    constructor(id, name, room) {
        this.name = name;
        this.id = id;
        this.room = room;
    }
}

class Users {

    constructor() {
        this.people = [];
    }

    addPerson(id, name, room) {
        let person = new User(id, name, room);
        this.people.push(person);
        return this.people;
    }

    getPerson(id) {
        let person = this.people.filter(per => per.id === id)[0];
        return person;
    }

    getPeople() {
        return this.people;
    }

    getPeopleByRoom(room) {
        return this.people.filter(per => per.room === room);
    }

    removePerson(id) {
        let removedPerson = this.getPerson(id);
        this.people = this.people.filter(per => per.id !== id);
        return removedPerson;
    }

}

module.exports = {
    User,
    Users
}