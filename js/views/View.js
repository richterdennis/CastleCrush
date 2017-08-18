export default class View {
	constructor() {
		this.title = null;
		this.templateUrl = "";
		this.template = null;

		this._holder = document.createElement('div');
	}

	async init() {
		if(this.template === null) {
			this.template = await fetch(`${this.templateUrl}.html`)
				.then(r => r.text());
		}

		this._holder.innerHTML = this.template;
		this.registerListener();

		return this;
	}

	registerListener() {
		const eventTypes = ['click'];

		eventTypes.forEach(eventType => {
			this._holder.querySelectorAll(`[\\40 ${eventType}]`).forEach(element => {
				const funcName = element.getAttribute('@' + eventType);
				element.addEventListener(eventType, event => this[funcName](event));
			});
		});
	}

	show(target) {
		// this._holder.childNodes.forEach(target.appendChild.bind(target));
		while(this._holder.firstChild) {
			target.appendChild(this._holder.firstChild);
		}
	}
}
