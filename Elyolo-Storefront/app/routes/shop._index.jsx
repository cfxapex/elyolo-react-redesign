import {redirect} from 'react-router';

/**
 * /shop is the "Shop" entrypoint for the ELYOLO site.
 * We route it into Hydrogen's native collections browsing.
 *
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  void args;
  return redirect('/collections');
}

export default function ShopIndex() {
  return null;
}

/** @typedef {import('./+types/shop._index').Route} Route */

