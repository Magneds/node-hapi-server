const Hapi = require('@hapi/hapi');

const storage = new WeakMap();

/**
 *  Convenience wrapper for the Hapi framework
 *
 *  @class HapiServer
 */
class HapiServer {
	/**
	 *  Creates an instance of HapiServer
	 *
	 *  @memberof HapiServer
	 */
	constructor() {
		storage.set(this, {
			server: null,
			config: {},
			plugins: [],
			routes: [],
		});
	}

	/**
	 *  Add a set of configuration options, options that already exist will be overwritten
	 *
	 *  @param    {object}  args
	 *  @returns  HapiServer
	 *  @memberof HapiServer
	 */
	configure(...args) {
		const { config } = storage.get(this);

		args.forEach((settings) => {
			if (Array.isArray(settings)) {
				return this.configure(...settings);
			}

			if (settings && typeof settings === 'object') {
				Object.keys(settings).forEach(
					(key) => (config[key] = settings[key])
				);
			}
		});

		//  allow for chaining
		return this;
	}

	/**
	 *  Register one or more plugins
	 *
	 *  @param     {object|[object]}  ...args
	 *  @returns   HapiServer
	 *  @memberof  HapiServer
	 */
	plugin(...args) {
		const { plugins } = storage.get(this);

		args.forEach((plugin) => {
			plugins.push(...[].concat(plugin));
		});

		//  allow for chaining
		return this;
	}

	/**
	 *  Register one or more routes
	 *
	 *  @param     {object|[object]} ...args
	 *  @returns   HapiServer
	 *  @memberof  HapiServer
	 */
	route(...args) {
		const { routes } = storage.get(this);

		args.forEach((route) => {
			routes.push(...[].concat(route));
		});

		//  allow for chaining
		return this;
	}

	/**
	 *  Start the Hapi server instance, registering all prepared plugins and routes
	 *
	 *  @async
	 *  @returns   {object} server
	 *  @memberof  HapiServer
	 */
	async start() {
		const settings = storage.get(this);
		const { config, plugins, routes } = settings;

		if (settings.server) {
			throw new Error('Server already started');
		}

		settings.server = new Hapi.server(config);

		await settings.server.register(plugins);
		await settings.server.route(routes);
		await settings.server.start();

		return settings.server;
	}
}

module.exports = HapiServer;
