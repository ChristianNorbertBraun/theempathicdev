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
		<h1 class="text-3xl md:text-5xl break-words overflow-hidden">
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
</style>
