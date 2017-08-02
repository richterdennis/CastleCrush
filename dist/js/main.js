'use strict';

fetch('templates/sample.html').then(function (res) {
	return res.text();
}).then(function (html) {
	document.querySelector('main#view').innerHTML = html;
});