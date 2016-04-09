'use strict';

/**
 * module variables
 */
/**
 * @typedef {Object} languages
 * @typedef {Array}  languages.available
 * @typedef {string} languages.default
 */
var languages;
var options;
var validator;

/**
 * module dependencies
 */
validator = require( 'validator' );

/**
 * @param {IncomingMessage} req
 * @param {Object} req.accepted_languages
 * @param {Object} req.query
 * @param {Object} req.session
 *
 * @param {ServerResponse} res
 * @param {Function} next
 */
function lang( req, res, next ) {
  var accepted_language;
  var i;

  if ( !( req.session instanceof Object ) ) {
    throw new Error( 'langMiddleware(): the IncomingMessage req.session object does not exist. this middleware needs to be loaded after that object has been created with a middleware such as cookie-parser.' );
  }

  // allows the query string lang to override any current lang setting as long as there is a match in the languages.available provided
  if ( req.query instanceof Object && typeof req.query.lang === 'string' ) {
    if ( validator.isIn( req.query.lang, languages.available ) ) {
      req.session.lang = req.query.lang;
      next();
      return;
    }
  }

  // if req.session.lang is already set and matches one of the languages available provided by the config object,
  // don’t make any changes and continue with the next middleware process
  if ( typeof req.session.lang === 'string' && validator.isIn( req.session.lang, languages.available ) ) {
    if ( validator.isIn( req.session.lang, languages.available ) ) {
      next();

      return;
    }
  }

  // if req.accepted_languages has been set, and no req.session.lang has been set yet,
  // attempt to find a match between req.accetped_languages and languages.available
  if ( req.accepted_languages instanceof Array ) {
    for ( i = 0; i < req.accepted_languages.length; i += 1 ) {
      accepted_language = req.accepted_languages[ i ];

      if ( typeof accepted_language === 'string' ) {
        if ( validator.isIn( accepted_language, languages.available ) ) {
          req.session.lang = accepted_language;
          break;
        }
      }
    }
  }

  // if no req.session.lang has been set, fallback to the languages.default provided
  if ( typeof req.session.lang !== 'string' ) {
    if ( validator.isIn( languages.default, languages.available ) ) {
      req.session.lang = languages.default;
    }
  }

  next();
}

/**
 * @param {Object} options
 * @param {Object} options.languages
 *
 * @returns {Function|undefined}
 */
module.exports = function langMiddleware( options ) {
  if ( !( options instanceof Object ) ) {
    console.warn( 'langMiddleware(): language options not provided as an Object' );
    return;
  }

  if ( !( options.languages instanceof Object ) ) {
    console.warn( 'langMiddleware(): options.languages not provided as an Object' );
    return;
  }

  if ( !( options.languages.available instanceof Array ) ) {
    console.warn( 'langMiddleware(): options.languages.available not provided as an Array' );
    return;
  }

  if ( typeof options.languages.default !== 'string' ) {
    console.warn( 'langMiddleware(): options.languages.default not provided as a string' );
    return;
  }

  languages = options.languages;
  return lang;
};