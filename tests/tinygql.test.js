var TinyGQL = require('../');

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    var gql = new TinyGQL();
    expect(gql.opts.url).toBe('/graphql');
    expect(gql.opts.sendModifier).toBe(null);

    var fragmentName = gql.storeFragment('\
      fragment companyFragment on CompanyType {\
        companyId\
        name\
      }\
    ');

    expect(fragmentName).toBe('companyFragment');
    expect(gql.fragments[fragmentName]).toBeDefined();

    gql.removeFragment(fragmentName);
    expect(gql.fragments[fragmentName]).not.toBeDefined();

    var badFragmentCall = function() {
      gql.storeFragment('\
        companyFragment on CompanyType {\
          companyId\
          name\
        }\
      ');
    };

    expect(badFragmentCall).toThrow();
  });
});