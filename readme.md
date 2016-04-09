# node-lang
an express middleware.

adds a string to the IncomingMessage object, `req.lang`, based on a config json that specifies the application’s available and default language.

the middleware attempts to find a match between the available languages provided by the config json and:
* one requested via the query string lang
* or the client’s accept-language header

if no match is found, it defaults to the language provided as the default in the config object.

## setup and use
### /app/config/languages.json
create a config file that contains the available and default languages.
```javascript
{
  "available": [ "en", "fr", "nl" ],
  "default": "fr"
}
```

### /app/middleware/lang.js
create a middleware setup file; e.g., `lang.js`, with the following or similar content.
```javascript
'use strict';

/**
 * module variables
 */
var helpers;
var lang;
var path;

/**
 * module dependencies
 */
path = require( 'path' );
helpers = require( 'node-helpers' );
lang = require( 'node-lang' );

/**
 * @param {Function} app
 * @param {Function} app.use
 */
module.exports = function langMiddleware( app ) {
  if ( !helpers.fileExists( path.join( __dirname, '..', 'config', 'languages.json' ) ) ) {
    throw new Error( 'langMiddleware(): the file [ ' + path.join( __dirname, '..', 'config', 'languages.json' ) + ' ] does not exist.' );
  }

  app.use( lang( { languages: require( path.join( __dirname, '..', 'config', 'languages' ) ) } ) );
};
```

### /app/middleware/index.js
include the middleware file in the middleware compilation file.
```javascript
module.exports = function ( app ) {
  ...
  require( path.join( __dirname, 'lang' ) )( app );
  ...
}
```

after including the above, the IncomingMessage `req.lang` contains the lang value that best matches the languages available in the application and the preferred language of the requesting client.