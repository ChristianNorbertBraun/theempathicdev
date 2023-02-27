<script>
	import Card from '$lib/Card.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Card class="md:h-[unset] bg-zinc-800">
	{#each data.posts as post}
		<a href="blog/{post.slug}">
			<div class="flex rounded-xl flex-col p-8 bg-zinc-600 gap-2 ">
				<h2 class="text-2xl font-semibold text-white">{post.title}</h2>
				<p class="text-slate-300">{post.description}</p>
			</div>
		</a>
	{/each}
</Card>
