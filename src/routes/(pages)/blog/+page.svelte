<script>
	import BlogList from '$lib/BlogList.svelte';
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<BlogList posts={data.posts} />/div>
