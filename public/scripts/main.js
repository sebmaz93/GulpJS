class Person {
	constructor (name) {
		this.name = name;
	}
	hello() {
		if (typeof this.name === 'string') {
			return 'Hello i am '+ this.name ;
		} else {
			return 'Hello';
		}
	}
}

var arm = new Person('Arman');

// var name = 'Seb Maz';

document.write(arm.hello());