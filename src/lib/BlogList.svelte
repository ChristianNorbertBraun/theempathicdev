<script>
	/** @type {import('../routes/blog/$types').PageData} */
	export let posts;
	export let showHeading = true;
	export let compactView = false;
	export let darkMode = false; // New prop to control text color scheme
	
	function dateString(date) {
		let formattedDate = new Date(date).toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		return formattedDate;
	}
</script>

{#if showHeading}
	<h1 class="text-4xl font-bold">My Blog</h1>
{/if}

<div class="{compactView ? 'my-4' : 'my-8'}">
	{#each posts as post}
		<a href="blog/{post.slug}">
			<div class="transition flex rounded-xl flex-col p-{compactView ? '4' : '8'} gap-2 transition-property: all transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) transition-duration: 150ms {darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}">
				<h2 class="text-2xl font-semibold {darkMode ? 'text-white' : 'text-gray-800'}">{post.title}</h2>
				<p class="text-sm {darkMode ? 'text-slate-300' : 'text-slate-500'}">{dateString(post.date)}</p>
				<p class="{darkMode ? 'text-slate-300' : 'text-slate-600'}">{post.description}..</p>
			</div>
		</a>
		{#if !compactView}
			<hr class="w-4/5" />
		{/if}
	{/each}
</div>
