# Node Hapi Server
A configurable webserver package for easy bootstrapping a full blown webserver, microservice or anything in between.

## Installation
```
$ npm install --save @magneds/node-hapi-server
```

## Usage
As with the installation, the scope is required to use the package as well.

```
const HapiServer = require('@magneds/hapi-server');

HapiServer
	.configure()
	.plugin()
	.route()

	.start({
		config: {

		},
		plugins: [
			//  ..  your hapi compatible plugins here
		],
		routes: [
			//  ..  your hapi compatible routes here
		],
	})
	.then((server) => {
		console.log(`Server running at: ${server.info.uri}`);
	});
```