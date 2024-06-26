export const prerender = true
import { fetchBlogPosts } from '$lib/utils';


  /** @type {import('./$types').PageLoad} */
export async function load() {
  console.log('Loading blog posts');
  return fetchBlogPosts(4);
}
