<script>
	import { onMount } from 'svelte';

	let dark = false;

	onMount(() => {
		dark = document.documentElement.classList.contains('dark');
	});

	function toggle() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		try {
			localStorage.setItem('theme', dark ? 'dark' : 'light');
		} catch (e) {
			// Storage may be unavailable (e.g. private mode); the toggle still works for this page view.
		}
	}
</script>

<button
	type="button"
	role="switch"
	aria-checked={dark}
	aria-label="Dark mode"
	title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
	on:click={toggle}
	class="relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-slate-300 bg-slate-200 p-0.5 shadow-inner transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 dark:border-emerald-500 dark:bg-emerald-500 dark:focus-visible:ring-offset-slate-900"
>
	<span
		aria-hidden="true"
		class="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-md ring-1 ring-black/5 transition-transform duration-300 ease-in-out {dark
			? 'translate-x-5'
			: 'translate-x-0'}"
	>
		{dark ? '🌙' : '☀️'}
	</span>
</button>
