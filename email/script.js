const getEmails = () => {
	return fetch('http://localhost:3000/emails').then(response => response.json()).then(emails => emails);
}

window.addEventListener('DOMContentLoaded', async () => {
	const emailList = document.querySelector('#emailList');

	// retrieves initial emails and creates initial list
	const emails = await getEmails();
	
	emails.forEach(email => {
		const li = document.createElement('li');
		li.classList.add('emailList__item');
		li.innerHTML = `
			<a href='#' class='email'>
				<input type='checkbox' class='email__checkbox'>
				<span class='email__subject'>${ email.subject }</span>
				<span class='email__body'>${ email.body }...</span>
			</a>
		`;
		emailList.appendChild(li);
	})

	// checks for new emails

	// adds new emails to list
});