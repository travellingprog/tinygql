# TinyGQL

A tiny GraphQL browser client library with zero dependencies.

Feb 4, 2017: At the time of this writing, the minified library's file size is 1.88 kb.

Note that this library uses XMLHttpRequest, which is expected to be present in the browser environment.

## Install As A Node Dependency

TinyGQL is published on NPM.

```sh
npm install tinygql
```

In your application:
```js
const TinyGQL = require('tinygql');
```

## Download

TinyGQL is also available on the [unpkg](https://unpkg.com/) CDN, as a UMD module. Therefore, you can load the latest version with a script tag. For example:

```html
<!-- Minified version -->
<script src="https://unpkg.com/tinygql/umd/tinygql.min.js"></script>

<!-- Non-minified version -->
<script src="https://unpkg.com/tinygql/umd/tinygql.min.js"></script>
```

You can also download the latest version of TinyGQL by right-clicking and saving on these links:
- [Minified version](https://unpkg.com/tinygql/umd/tinygql.min.js)
- [Non-minified version](https://unpkg.com/tinygql/umd/tinygql.min.js)

It's also possible to load a specific version of TinyGQL. Visit [unpkg](https://unpkg.com/) to learn more.

```html
<!-- Examples: -->
<script src="https://unpkg.com/tinygql@0.0.4/umd/tinygql.min.js"></script>
<script src="https://unpkg.com/tinygql@^0/umd/tinygql.min.js"></script>
```

You can also check the file size of the latest version [here](https://unpkg.com/tinygql/umd/).

## Usage

Here are the basics. There's a bit more functionality that I will document at a later date.

```js
const gql = new TinyGQL({
  url: '/mygraphqlapi',  // default: '/graphql'
});

const fragmentKey = gql.storeFragment(`
  fragment companyFragment on CompanyType {
    companyId
    name
  }
`);

const getListRequest = {
  query: `
    {
      listCompany {
        ...companyFragment
      }
    }
  `,
};

const createCompanyRequest = {
  // 'mutation' is just an alias of 'query', for code legibility
  mutation: `
    mutation CreateCompany($name: String!) {
      createCompany(name: $name) {
        ...companyFragment
      }
    }
  `,
  variables: { name: 'Tech Underground' },
};



gql.send(getListRequest, (err, data) => {
  if (err) throw err;

  console.log('company list', data);
  gql.send(createCompanyRequest, (err, data) => {
    if (err) throw err:

    console.log('new company', data);
    gql.send(getListRequest, (err, data) => {
      if (err) throw err:

      console.log('updated company list', data);
      gql.removeFragment(fragmentKey);
    });
  });
});
```

## Why Not Return Promises?

I definitely encourage you to use Promises! But I wanted this library to be minimal and not require any external dependency, and unfortunately not all browsers support Promises natively at this moment (but we're almost [there](http://caniuse.com/#feat=promises)). For now, this library makes use of Node-style callbacks.

Therefore, I'll make another module that wraps this library with native Promises.

Another alternative is to wrap TinyGQL using a Promise library. For example, you could use bluebird's [Promise.promisify](http://bluebirdjs.com/docs/api/promise.promisify.html).
