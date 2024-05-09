import { slugFromPath } from "./slugFromPath";

export const convertDate = (published: string) => {
    const months: {[id: number]: string} = {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Oct',
        11: 'Nov',
        12: 'Dec'
    };
    const date = published.substring(0, 10);
    const [year, month, day] = date.split('-');
    return `${day}-${months[parseInt(month)]}-${year}`;
};

export const fetchBlogPosts = async (maxNumber?: number) => {
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
    const publishedPosts = posts.filter((post) => post.published).slice(0, maxNumber ?? posts.length);

    publishedPosts.sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

    return { posts: publishedPosts };
}
