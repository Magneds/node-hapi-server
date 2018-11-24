const Hapi = require('hapi');

const storage = new WeakMap();

class HapiServer {
	constructor() {
		storage.set(this, { server: null, config: {}, plugins: [], routes: [] })
	}

	configure(...args) {
		const { config } = storage.get(this);

		args.forEach((settings) => {
			if (Array.isArray(settings)) {
				return this.configure(...settings);
			}

			if (typeof settings === 'object') {
				Object.keys(settings)
					.forEach((key) => config[key] = settings[key]);
			}
		})

		//  allow for chaining
		return this;
	}

	plugin(...args) {
		const { plugins } = storage.get(this);

		args.forEach((plugin) => {
			plugins.push(...[].concat(plugin));
		})

		//  allow for chaining
		return this;
	}

	route(...args) {
		const { routes } = storage.get(this);

		args.forEach((route) => {
			routes.push(...[].concat(route));
		})

		//  allow for chaining
		return this;
	}

	async start() {
		const settings = storage.get(this);
		const { config, plugins, routes } = settings;

		if (settings.server) {
			throw new Error('Server already started');
		}
		console.log(config);
		settings.server = new Hapi.server(config);

		await settings.server.register(plugins);
		await settings.server.route(routes);
		await settings.server.start();

		return settings.server;
	}
}

module.exports = HapiServer;
