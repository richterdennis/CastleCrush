fetch('templates/sample.html')
	.then(res => res.text())
	.then(html => {
		document.querySelector('main#view').innerHTML = html;
	})
