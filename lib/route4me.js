var request = require('request')
  , _ = require('underscore');

var resources = {
  Track: require('./resources/track')
, Route: require('./resources/route')
, OptimizationProblem: require('./resources/optimization_problem')
};

function Route4me(api_key) {
  if (!(this instanceof Route4me)) {
    return new Route4me(api_key);
  }

  this._useResources();
  this.setBaseUrl('http://route4me.com');
  this.api_key = api_key;
}

Route4me.prototype.setBaseUrl = function(base_url) {
  this.url_base = base_url;
}

Route4me.prototype._useResources = function() {
  for (var name in resources) {
    this[name] = resources[name](this);
  }
}

Route4me.prototype.getApiKey = function () {
  return this.api_key;
};

Route4me.prototype._generateUrl = function(url) {
  return this.url_base + url;
}

Route4me.prototype._makeRequest = function(options, callback) {
  var qs = _.extend({
    api_key: this.getApiKey()
  }, options['qs'] || {});
  delete options['qs'];

  options = _.extend({
    json: true
  , qs: qs
  , body: options['body'] ? JSON.stringify(options['body']) : ''
  , headers:  { 'User-Agent': 'Route4me nodejs sdk' }
  }, options);

  request(options, function(err, res, body) {
    if (err) {
      console.log(err);
      return callback(err);
    }

    if (404 === res.statusCode) {
      console.log(body);
      callback('Page not found');
    } else {
      callback(null, body);
    }
  });
};

Route4me.version = require('../package.json').version;
module.exports = Route4me;