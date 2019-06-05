const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { experiment, test, it } = (exports.lab = Lab.script());

const HapiServer = require(`${__dirname}/../..`);

experiment('Configures', () => {
	const hapi = new HapiServer();

	test('configure allows for multiple calls', () => {
		expect(hapi.configure({ host: '127.0.0.1' })).to.equal(hapi);
		expect(hapi.configure({ port: 50000 })).to.equal(hapi);
		expect(hapi.configure([{ port: 50001 }], [{ port: 50002 }])).to.equal(
			hapi
		);
	});

	test('configure only works on objects, ignoring any other type', () => {
		expect(hapi.configure(null)).to.equal(hapi);
		expect(hapi.configure(true)).to.equal(hapi);
		expect(hapi.configure(false)).to.equal(hapi);
		expect(hapi.configure('foo')).to.equal(hapi);
		expect(hapi.configure(Math.PI)).to.equal(hapi);
	});

	test('Hapi start', () => {
		hapi.start().then((server) => {
			expect(server).to.contain('info');
			expect(server.info).to.be.object();

			expect(server.info).to.contain('protocol');
			expect(server.info.protocol).to.equal('http');

			expect(server.info).to.contain('address');
			expect(server.info.address).to.equal('127.0.0.1');

			expect(server.info).to.contain('port');
			expect(server.info.port).to.equal(50002);
		});

		hapi.start()
			.catch((error) => {
				expect(error).to.match(/Server already started/);
			})
			.then((server) => {
				expect(server).to.be.undefined();
			});
	});
});
