<script lang="ts">
	import type { PageData } from './$types';
	import type { SvelteComponentTyped } from 'svelte/internal';
	import { page } from '$app/stores';
	export let data: PageData;
	type C = $$Generic<typeof SvelteComponentTyped<any, any, any>>;
	$: component = data.component as unknown as C;

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

<div class="md:flex md:items-center md:justify-center">
	<div class="prose">
		<h1 class="text-3xl md:text-5xl break-words overflow-hidden" style="letter-spacing: 0.05em; line-height: 1.3; margin-bottom: 1.5rem;">
			{data.frontmatter.title}
		</h1>
		<p class="text-sm text-slate-500">{dateString(data.frontmatter.date)}</p>
    <article class="prose">
      <svelte:component this={component} />
    </article>
	</div>
</div>

<style>
	@import url(prism.css);

	/* Drop cap for the first paragraph after h2 headings */
	article :global(h2 + p::first-letter),
	article :global(h2 + img + p::first-letter) {
		float: left;
		font-size: 3.5em;
		line-height: 0.9;
		margin-right: 0.1em;
		margin-top: 0.1em;
		color: #374151; /* Tailwind gray-700 */
		font-family: Georgia, serif;
	}

	/* Responsive inline images - float on desktop, block on mobile */
	article :global(h2 + img) {
		display: block !important;
		margin: 0 auto 1rem auto !important;
		float: none !important;
		border-radius: 8px !important;
	}

	@media (min-width: 768px) {
		article :global(h2 + img) {
			float: left !important;
			margin-right: 15px !important;
			margin-bottom: 10px !important;
			margin-left: 0 !important;
		}
	}
</style>
