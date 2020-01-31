const casual = require('casual-browserify');
const emailsEndpoint = 'http://localhost:3000/emails';
let toDelete = [];

const emailList = document.querySelector('#emailList');

const addNewEmail = email => {
	const li = document.createElement('li');
	li.classList.add('emailList__item');

	const a = document.createElement('a');
	a.setAttribute('href', `http://localhost:3000/emails/${ email.id }`);
	a.classList.add('email');
	a.innerHTML = `
		<input type='checkbox' class='email__checkbox'>
		<span class='email__subject'>${ email.subject }</span>
		<span class='email__body'>${ email.body }</span>
	`;

	li.appendChild(a);
	emailList.prepend(li);
}

const getInitialEmails = () => {
	fetch(emailsEndpoint).then(response => response.json()).then(emails => emails.forEach(email => addNewEmail(email)));
}

const setupEventListeners = () => {
	const deleteButton = document.querySelector('.buttons__delete');
	const createButton = document.querySelector('.buttons__create');
	let intervalId;

	createButton.addEventListener('click', e => {
		e.preventDefault();
		
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
			createButton.textContent = 'Create New Emails';
		} else {
			createButton.textContent = 'Stop';
			intervalId = setInterval(async () => {
				const email = {};
				const hrefArray = emailList.firstChild.children[0].getAttribute('href').split('/');
	
				email.id = parseInt(hrefArray[hrefArray.length - 1]) + 1;
				email.subject = casual.title;
				email.body = casual.sentences(n = 10);
	
				const createdEmail = await fetch(emailsEndpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(email)
				}).then(response => {
					return response.json();
				});

				addNewEmail(createdEmail);

				console.log('Created Email: ', createdEmail);
			}, 2000);
		}
	});

	emailList.addEventListener('click', e => {
		if (e.target.type === 'checkbox') {
			toDelete.push(e.target.parentElement.parentElement)
		}
	});

	deleteButton.addEventListener('click', () => {
		if (!toDelete.length) {
			return;
		}

		console.log('Deleting...');

		toDelete.forEach(el => {
			console.log(el);
			el.remove()
		});

		toDelete = [];
	})
}

window.addEventListener('DOMContentLoaded', async () => {
	await getInitialEmails();
	setupEventListeners();
});