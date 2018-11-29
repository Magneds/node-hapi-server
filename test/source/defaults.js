const Lab = require('lab');
const { expect } = require('code');
const { experiment, test, it } = (exports.lab = Lab.script());

const HapiServer = require(`${__dirname}/../..`);

experiment('Default settings (unconfigured)', () => {
	const hapi = new HapiServer();

	test('configure method return HapiServer instance', () => {
		expect(hapi.configure()).to.equal(hapi);
	});

	test('plugin method return HapiServer instance', () => {
		expect(hapi.plugin()).to.equal(hapi);
	});

	test('route method return HapiServer instance', () => {
		expect(hapi.route()).to.equal(hapi);
	});

	test('start method returns a promise', () => {
		hapi.start().then((server) => {
			expect(server).to.contain('info');
			expect(server.info).to.be.object();

			expect(server.info).to.contain('protocol');
			expect(server.info.protocol).to.equal('http');

			expect(server.info).to.contain('address');
			expect(server.info.address).to.equal('0.0.0.0');

			expect(server.info).to.contain('port');
			//  we can't predict the port if none was provided
		});

		hapi
			.start()
			.catch((error) => {
				expect(error).to.match(/Server already started/);
			})
			.then((server) => {
				expect(server).to.be.undefined();
			});
	});
});
