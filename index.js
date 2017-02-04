'use strict';

function TinyGQL (opts) {
  opts = opts || {};
  this.opts = {
    url: opts.url || '/graphql',
    sendModifier: opts.sendModifier || null,
  };

  this.fragments = {};
}

TinyGQL.prototype.storeFragment = function (fragmentStr) {
  var fragmentNameRegex = /fragment\s*([_A-Za-z][_0-9A-Za-z]*)\s/;
  var match = fragmentNameRegex.exec(fragmentStr);
  if (!match) {
    throw new Error('TinyGQL.storeFragment() - no fragment name found!');
  }

  var fragmentName = match[1];
  this.fragments[fragmentName] = fragmentStr.trim();
  return fragmentName;
}

TinyGQL.prototype.removeFragment = function (fragmentName) {
  delete this.fragments[fragmentName];
}

TinyGQL.prototype.send = function (request, callback) {
  var query = request.query || request.mutation;
  var variables = request.variables;
  var operationName = request.operationName;
  var sendModifier = request.sendModifier || this.sendModifier;

  var fragmentMap = getFragmentMap(query, this.fragments);

  var body = createBody(query, variables, operationName, fragmentMap);
  var xhr = createXHR(this.opts.url, callback);

  if (sendModifier) {
    var modResult = sendModifier({ xhr: xhr, body: body });
    body = modResult.body;
    xhr = modResult.xhr;
  }

  xhr.send(JSON.stringify(body));
}

function getFragmentMap(queryOrFragment, storedFragments, fragmentMap) {
  fragmentMap = fragmentMap || {};
  var fragmentSpreadRegex = /\.\.\.\s*([_A-Za-z][_0-9A-Za-z]*)\s/g;

  var matchArray;
  while ((matchArray = fragmentSpreadRegex.exec(queryOrFragment)) !== null) {
    var fragmentName = matchArray[1];
    if (fragmentName === 'on' || fragmentMap[fragmentName] || !storedFragments[fragmentName]) {
      continue;
    }

    fragmentMap[fragmentName] = storedFragments[fragmentName];
    getFragmentMap(storedFragments[fragmentName], storedFragments, fragmentMap);
  }

  return fragmentMap;
}

function createBody(query, variables, operationName, fragmentMap) {
  var fragments = [];
  for (var key in fragmentMap) {
    fragments.push(fragmentMap[key]);
  }
  query = [query].concat(fragments).join('\n');

  var body = { query: query };
  if (variables) body.variables = variables;
  if (operationName) body.operationName = operationName;
  return body;
}

function createXHR(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onload = function () {
    if (xhr.status < 200 || xhr.status > 299) {
      return requestError(new Error('request status code is ' + xhr.status));
    }

    // For browsers that don't support responseType
    if (typeof xhr.response === 'string') {
      xhr.response = JSON.parse(xhr.response);
    }

    if (!xhr.response || (!xhr.response.data && !xhr.response.errors)) {
      return requestError(new Error('invalid response ' + JSON.stringify(xhr.response)));
    }

    if (xhr.response.errors) {
      var queryError = new Error('the GraphQL response has errors ' +
        JSON.stringify(xhr.response.errors));
      queryError.name = 'TinyGQLQueryError';
      queryError.raw = xhr.response.errors;
      callback(queryError, null);
    } else {
      callback(null, xhr.response.data);
    }
  };
  xhr.onerror = requestError;

  var requestError = function (err) {
    err.name = 'TinyGQLRequestError';
    callback(err, null);
  }

  return xhr;
}

module.exports = TinyGQL;