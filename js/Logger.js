export default {
	create: function(options = {}) {
		const bind = [window.console];
		if(options.prefix)
			bind.push(options.prefix);

		return ['info', 'warn', 'error'].reduce((logger, fn) => {
			logger[fn] = Function.prototype.bind.apply(console[fn], bind);
			return logger;
		}, {});
	}
};
