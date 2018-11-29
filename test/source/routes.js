const Lab = require('lab');
const { expect } = require('code');
const { experiment, test, it } = (exports.lab = Lab.script());

const HapiServer = require(`${__dirname}/../..`);

experiment('Routes', () => {
	const names = ['foo', 'bar', 'baz', 'qux'];
	const routes = names.map((name) => ({
		method: 'GET',
		path: `/${name}`,
		handler(request, h) {
			return h.response(name);
		}
	}));
	const inject = names.map((name) => async (server) => {
		const response = await server.inject({ method: 'GET', url: `/${name}` });

		expect(response).to.be.object();
		expect(response.statusCode).to.equal(200);
		expect(response.result).to.equal(name);
	});
	const notfound = async (server) => {
		const response = await server.inject({ method: 'GET', url: '/' });

		expect(response).to.be.object();
		expect(response.statusCode).to.equal(404);
	};

	test('adds single route as object', () =>
		new HapiServer()
			.route(routes[0])
			.start()
			.then(async (server) => {
				await inject[0](server);

				await notfound(server);
			}));

	test('adds multiple routes as objects', () =>
		new HapiServer()
			.route(routes[0], routes[1])
			.start()
			.then(async (server) => {
				await inject[0](server);
				await inject[1](server);

				await notfound(server);
			}));

	test('adds multiple routes as objects in multiple invocations', () =>
		new HapiServer()
			.route(routes[0])
			.route(routes[1])
			.start()
			.then(async (server) => {
				await inject[0](server);
				await inject[1](server);

				await notfound(server);
			}));

	test('adds multiple routes from single array', () =>
		new HapiServer()
			.route(routes.slice(0, 2))
			.start()
			.then(async (server) => {
				await inject[0](server);
				await inject[1](server);

				await notfound(server);
			}));

	test('adds multiple routes from multiple arrays', () =>
		new HapiServer()
			.route(routes.slice(0, 2), routes.slice(2, 4))
			.start()
			.then(async (server) => {
				await inject[0](server);
				await inject[1](server);
				await inject[2](server);
				await inject[3](server);

				await notfound(server);
			}));

	test('adds multiple routes as objects in multiple invocations', () =>
		new HapiServer()
			.route(routes.slice(0, 2))
			.route(routes.slice(2, 4))
			.start()
			.then(async (server) => {
				await inject[0](server);
				await inject[1](server);
				await inject[2](server);
				await inject[3](server);

				await notfound(server);
			}));
});
