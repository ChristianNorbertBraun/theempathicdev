export const prerender = true
import { slugFromPath } from '$lib/slugFromPath';

const MAX_POSTS = 10;

  /** @type {import('./$types').PageLoad} */
export async function load() {
    const modules = import.meta.glob(`/src/blog/*.{md,svx,svelte.md}`);
	const postPromises = Object.entries(modules).map(([path, resolver]) =>
		resolver().then(
			(post) =>
				({
					slug: slugFromPath(path),
					...(post as unknown as App.MdsvexFile).metadata
				} as App.BlogPost)
		)
	);

	const posts = await Promise.all(postPromises);
	const publishedPosts = posts.filter((post) => post.published).slice(0, MAX_POSTS);

	publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

	return { posts: publishedPosts };
  }