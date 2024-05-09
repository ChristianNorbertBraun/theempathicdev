<script>
	import Card from '$lib/Card.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	function dateString(date) {
		let formattedDate = new Date(date).toLocaleDateString('en-US', {
			weekday: 'long', // "Monday"
			year: 'numeric', // "2023"
			month: 'long', // "January"
			day: 'numeric' // "1"
		});
		return formattedDate;
	}
</script>

<h1 class="text-4xl font-bold">My Blog</h1>
<div class="my-8">
	{#each data.posts as post}
		<a href="blog/{post.slug}">
			<div class="transition flex rounded-xl flex-col p-8 gap-2 transition-property: all transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) transition-duration: 150ms hover:bg-slate-200">
				<h2 class="text-2xl font-semibold text-gray">{post.title}</h2>
				<p class="text-sm text-slate-500">{dateString(post.date)}</p>
				<p class="text-slate-600">{post.description}..</p>
			</div>
		</a>
		<hr class="w-4/5" />
	{/each}
</div>
