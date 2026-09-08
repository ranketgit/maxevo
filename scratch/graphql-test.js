const query = `
  query GetFeaturedProducts {
    products(first: 2) {
      nodes {
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          price
        }
      }
    }
  }
`;

async function test() {
    try {
        const response = await fetch("https://admin.maxevopackaging.ma/graphql", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        const json = await response.json();
        console.log(JSON.stringify(json, null, 2));
    } catch (error) {
        console.error(error);
    }
}
test();
