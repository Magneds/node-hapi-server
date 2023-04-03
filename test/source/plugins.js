const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { experiment, test, it } = (exports.lab = Lab.script());

const HapiServer = require(`${__dirname}/../..`);

experiment('Plugins', () => {
	const names = ['foo', 'bar', 'baz', 'qux'];
	const plugins = names.map((name, index, all) => ({
		name,
		version: `${index + 1}.0.0`,
		dependencies: index ? [all[index - 1]] : undefined,
		async register(server) {
			await server.route({
				method: 'GET',
				path: `/plugin/${name}`,
				handler(request, h) {
					return h.response(`plugin ${name}`);
				},
			});
		},
	}));
	const inject = names.map((name) => async (server) => {
		const response = await server.inject({
			method: 'GET',
			url: `/plugin/${name}`,
		});

		expect(response).to.be.object();
		expect(response.statusCode).to.equal(200);
		expect(response.result).to.equal(`plugin ${name}`);
	});
	const notfound = async (server) => {
		const response = await server.inject({ method: 'GET', url: '/' });

		expect(response).to.be.object();
		expect(response.statusCode).to.equal(404);
	};

	test('adds single plugin as object', () =>
		new HapiServer()
			.plugin(plugins[0])
			.start()
			.then(async (server) => {
				await inject[0](server);

				await notfound(server);
			}));

	test('adds multiple plugins as objects', () =>
		new HapiServer()
			.plugin(plugins[0], plugins[1])
			.start()
			.then(async (server) => {
				await inject[0](server);
				await inject[1](server);

				await notfound(server);
			}));

	test('adds multiple plugins as objects in multiple invocations', () =>
		new HapiServer()
			.plugin(plugins[0])
			.plugin(plugins[1])
			.start()
			.then(async (server) => {
				await inject[0](server);
				await inject[1](server);

				await notfound(server);
			}));

	test('adds multiple plugins from single array', () =>
		new HapiServer()
			.plugin(plugins.slice(0, 2))
			.start()
			.then(async (server) => {
				await inject[0](server);
				await inject[1](server);

				await notfound(server);
			}));

	test('adds multiple plugins from multiple arrays', () =>
		new HapiServer()
			.plugin(plugins.slice(0, 2), plugins.slice(2, 4))
			.start()
			.then(async (server) => {
				await inject[0](server);
				await inject[1](server);
				await inject[2](server);
				await inject[3](server);

				await notfound(server);
			}));

	test('adds multiple plugins as objects in multiple invocations', () =>
		new HapiServer()
			.plugin(plugins.slice(0, 2))
			.plugin(plugins.slice(2, 4))
			.start()
			.then(async (server) => {
				await inject[0](server);
				await inject[1](server);
				await inject[2](server);
				await inject[3](server);

				await notfound(server);
			}));

	test('nags about plugin dependencies', () =>
		new HapiServer()
			.plugin(plugins[1])
			.start()
			.catch((error) => {
				expect(error).to.match(
					new RegExp(
						`Plugin ${names[1]} missing dependency ${names[0]}`
					)
				);
			}));
});
