export const prerender = true
import { fetchBlogPosts } from '$lib/utils';

  /** @type {import('./$types').PageLoad} */
export async function load() {
  return fetchBlogPosts(undefined);
}
