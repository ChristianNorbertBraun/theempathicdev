<script lang="ts">
	import type { PageData } from './$types';
	import type { SvelteComponentTyped } from 'svelte/internal';
	import { page } from '$app/stores';
	export let data: PageData;
	type C = $$Generic<typeof SvelteComponentTyped<any, any, any>>;
	$: component = data.component as unknown as C;
</script>

<div class="flex flex-col items-center">
	<div>
		<h1 class="text-4xl font-bold pb-4">
			{data.frontmatter.title}
		</h1>
		<article class="prose prose-a:underline prose-a:decoration-emerald-400 prose-a:decoration-4 prose-code:bg-zinc-600 prose-code:text-emerald-400 prose-code:rounded prose-code:p-px">
			<svelte:component this={component} />
		</article>
	</div>
</div>

<style>
	@import url(prism.css);
</style>
