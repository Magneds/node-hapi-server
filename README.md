# Node Hapi Server

A configurable webserver package for easy bootstrapping a full blown webserver, microservice or anything in between.

## Installation

The HapiServer package is a scoped packages, which means you'll have to include the scope during installation.

```
$ npm install --save @magneds/hapi-server
```

## Usage

As with the installation, the scope is required to use the package as well.

```js
const HapiServer = require('@magneds/hapi-server');

new HapiServer()
	//  configure the server (call as many times as needed, existing value will
	//  be overwritten)
	.configure(/* hapi server configuration option(s) */)

	//  add plugins (provide plugin objects, or arrays of them, call as often
	//  as needed)
	.plugin(/* any plugin */)

	//  add routes (provide route objects, or arrays of them, call as often
	//  as needed)
	.route(/* any route */)

	//  start the server
	.start()

	//  do something relevant once started (or catch errors)
	.then((server) => {
		console.log(`Server running at: ${server.info.uri}`);
	});
```

## API

HapiServer allows for a mixture of methods, whatever floats your boat, the only real requirement is to add at least the configuration of `host` and `port` (and even that is - as per Hapi - not mandatory, it just makes predicting the host and port more consistent) and as final call the `start` method.

### `configure(...<object)`

Set server configuration options. This method can be called multiple times, where it will overwrite any existing configuration option.

```js
const HapiServer = require('@magneds/hapi-server');

new HapiServer()
	.configure({ host: 'localhost', port: 30080 })
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

new HapiServer()
	.configure({ host: 'localhost', port: 3000 })
	.plugin(MyFirstPlugin)
	.plugin(MySecondPlugin)
	.plugin(MyThirdPlugin)
	.plugin(MyFourthPlugin)
	//...
	.start();
```

### `route(<object>|[<object>])`

Register one or more Hapi compatible routes. It allows for both objects and arrays, both also in a variadic (spread, splat, `...`) way.
Any mix of the following calls will have the same result:

-   `route({ method: 'GET', path: '/one', handler(request, h) { return h.response('one'); }}, ...)`
-   `route([{ method: 'GET', path: '/one', handler(request, h) { return h.response('one'); }}, ...])`

```js
const HapiServer = require('@magneds/hapi-server');

new HapiServer()
	.configure({ host: 'localhost', port: 3000 })
	.route({
		method: 'GET',
		path: '/one',
		handler(request, h) {
			return h.response('one');
		}
	})
	.route([
		{
			method: 'GET',
			path: '/two',
			handler(request, h) {
				return h.response('two');
			}
		},
		{
			method: 'GET',
			path: '/three',
			handler(request, h) {
				return h.response('three');
			}
		}
	])
	.route(
		{
			method: 'GET',
			path: '/four',
			handler(request, h) {
				return h.response('four');
			}
		},
		{
			method: 'GET',
			path: '/five',
			handler(request, h) {
				return h.response('five');
			}
		}
	)
	//...
	.start();
```

### `start()`

As the name indicates, this will start the server. All of the configuration options, plugins and routes are prepared at this point and the Hapi server is started and provided in the Promise resolve.

```js
const HapiServer = require('@magneds/hapi-server');

new HapiServer()
	//...
	.start()
	.then((server) => {
		console.log(`Server running at: ${server.info.uri}`);
	})
	.catch((error) => {
		console.error(error);
	});
```
