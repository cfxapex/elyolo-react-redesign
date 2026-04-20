const storeDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const apiVersion = import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-10';

export function isShopifyConfigured() {
  return Boolean(storeDomain && storefrontToken);
}

export async function shopifyFetch(query, variables = {}) {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify is not configured. Set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN.');
  }

  const endpoint = `https://${storeDomain}/api/${apiVersion}/graphql.json`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontToken
    },
    body: JSON.stringify({ query, variables })
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.errors?.[0]?.message || `Shopify request failed (${res.status})`);
  }
  if (json?.errors?.length) {
    throw new Error(json.errors[0]?.message || 'Shopify GraphQL error');
  }

  return json.data;
}

