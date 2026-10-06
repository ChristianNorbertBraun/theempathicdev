<script>
	import '../../app.postcss';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
</script>

<div
	class="max-w-6xl m-auto w-screen p-4 bg-white text-gray-900 dark:bg-slate-900 dark:text-slate-100 md:my-4 md:rounded-xl"
>
	<div class="pb-4 flex gap-1 items-center">
		<div class="h-3 w-3 bg-red-600 rounded-full" />
		<div class="h-3 w-3 bg-yellow-400 rounded-full" />
		<div class="h-3 w-3 bg-green-500 rounded-full" />
		<a
			class="ml-auto hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
			href="/">The empathic dev</a
		>
		<div class="ml-4"><ThemeToggle /></div>
	</div>
	<slot />

	<footer class="mt-8">
		<hr class="w-full dark:border-slate-700" />
		<div class="flex mt-4">
			<a
				class="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
				href="/imprint">Imprint</a
			>
		</div>
	</footer>
</div>
