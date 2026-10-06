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
	role="switch"
	aria-checked={dark}
	aria-label="Dark mode"
	title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
	class="relative ml-2 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-slate-400 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:border-slate-500 dark:focus-visible:ring-offset-slate-800 {dark
		? 'bg-emerald-500'
		: 'bg-slate-300'}"
	on:click={toggle}
>
	<span
		aria-hidden="true"
		class="pointer-events-none inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-slate-700 shadow transition-transform duration-200 ease-in-out {dark
			? 'translate-x-5'
			: 'translate-x-0.5'}"
	>
		{dark ? '☾' : '☀'}
	</span>
</button>
