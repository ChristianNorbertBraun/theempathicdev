<script>
	import { onMount } from 'svelte';

	let dark = false;

	onMount(() => {
		// app.html already applied the stored or system preference before the first paint
		dark = document.documentElement.classList.contains('dark');

		const media = window.matchMedia('(prefers-color-scheme: dark)');
		/** @param {MediaQueryListEvent} event */
		function onSystemChange(event) {
			if (storedTheme() !== null) return;
			dark = event.matches;
			document.documentElement.classList.toggle('dark', dark);
		}
		media.addEventListener('change', onSystemChange);
		return () => media.removeEventListener('change', onSystemChange);
	});

	function storedTheme() {
		try {
			return localStorage.getItem('theme');
		} catch (e) {
			return null;
		}
	}

	function toggle() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		try {
			localStorage.setItem('theme', dark ? 'dark' : 'light');
		} catch (e) {
			// localStorage is not available, the choice only lasts for this page
		}
	}
</script>

<button
	type="button"
	class="ml-2 px-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
	aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
	title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
	on:click={toggle}
>
	{dark ? '☀' : '☾'}
</button>
