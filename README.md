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
			//  ..  your hapi configuration stuff
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

## API

HapiServer allows for a mixture of methods, whatever floats your boat, the only real requirement is to add at least the configuration of `host` and `port` and as final call the `start` method.

### `configure(<object>)`

Set server configuration options. This method can be called multiple times, where it will overwrite any existing configuration option.

```js
const HapiServer = require('@magneds/hapi-server');

HapiServer.configure({ host: 'localhost', port: 30080 })
	.configure({ port: 3000 }) //  override the port to be 3000
	//...
	.start();
```

### `plugin(<object>|[<object>])`

Register one or more Hapi compatible plugins. It allows for both objects and arrays, both also in a variadic (spread, splat, `...`) way.
Any mix of the following calls will have the same result:

-   `plugin(PluginOne, PluginTwo)`
-   `plugin([PluginOne, PluginTwo])`
-   `plugin(...[PluginOne, PluginTwo])`

```js
const HapiServer = require('@magneds/hapi-server');
const MyFirstPlugin = require('@my/first-plugin');
const MySecondPlugin = require('@my/second-plugin');
const MyThirdPlugin = require('@my/third-plugin');
const MyFourthPlugin = require('@my/fourth-plugin');

HapiServer.configure({ host: 'localhost', port: 3000 })
	.plugin(MyFirstPlugin)
	.plugin(MySecondPlugin)
	.plugin(MyThirdPlugin)
	.plugin(MyFourthPlugin)
	//...
	.start();
```
