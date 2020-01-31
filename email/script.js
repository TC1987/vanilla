const casual = require('casual-browserify');
const emailsEndpoint = 'http://localhost:3000/emails';

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
	emailList.appendChild(li);
}

const getInitialEmails = () => {
	fetch(emailsEndpoint).then(response => response.json()).then(emails => emails.forEach(email => addNewEmail(email)));
}

const setupEventListeners = () => {
	const createButton = document.querySelector('.buttons__create');
	let intervalId;

	createButton.addEventListener('click', () => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		} else {
			intervalId = setInterval(async () => {
				const email = {};
				const hrefArray = emailList.lastChild.lastChild.getAttribute('href').split('/');
	
				email.id = parseInt(hrefArray[hrefArray.length - 1]) + 1;
				email.subject = casual.title;
				email.body = casual.sentences(n = 10);
	
				addNewEmail(email);

				const createdEmail = await fetch(emailsEndpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(email)
				}).then(response => {
					return response.json()
				});

				console.log('Created Email: ', createdEmail);
			}, 2000);
		}

	})
}

window.addEventListener('DOMContentLoaded', async () => {
	await getInitialEmails();
	setupEventListeners();

	// adds new emails to list
});