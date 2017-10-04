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

		this.afterInit();

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
		this._target = target;

		// this._holder.childNodes.forEach(target.appendChild.bind(target));
		while(this._holder.firstChild) {
			target.appendChild(this._holder.firstChild);
		}
	}

	find(selector) {
		if(this._holder.firstChild)
			return this._holder.querySelector(selector);

		else if(this._target)
			return this._target.querySelector(selector);

		else
			return null;
	}

	afterInit() {}

	back(){
		return () => {
			console.log("geschaft");
		};
	}

}
