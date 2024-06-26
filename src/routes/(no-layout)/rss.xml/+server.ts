import type { RequestHandler } from '@sveltejs/kit';
import { fetchBlogPosts } from '$lib/utils';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const posts = await fetchBlogPosts(undefined).then(data => data.posts);

	const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>The empathic dev</title>
<link>https://theempathicdev.de</link>
<description>Exploring iOS development through the lens of an experienced freelancer, this blog emphasizes the critical roles of communication and empathy in tech. Dive into personal insights and professional tips that elevate both code and collaboration.</description>
<language>en-us</language>
<atom:link href="https://theempathicdev.de/rss.xml" rel="self" type="application/rss+xml" />
${posts.map(post => `<item>
<title>${post.title}</title>
<link>https://theempathicdev.de/blog/${post.slug}</link>
<description>${post.description}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
</item>`).join('')}
</channel>
</rss>`;

	return new Response(xmlContent, {
		headers: {
			'Content-Type': 'application/rss+xml'
		}
	});
};
