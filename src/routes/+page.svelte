<script>
	import Card from '../lib/Card.svelte';
</script>

<div class="grid grid-cols-1 w-screen p-4 gap-4">
	<Card class="gradient text-gray-800">
		<h1 class="text-4xl font-semibold">I'm Christian iOS Freelancer with 6 years of experience</h1>
		<p>
			I care a lot about human friendly interface design and excellent code quality. Don’t take my
			word for it, check out my portfolio.
		</p>
		<div class="mt-auto">
			<a
				class="bg-pink-500 text-white px-4 py-2 rounded-full text-lg"
				href="mailto:christian.braun@theempathicdev.de">Contact me</a
			>
		</div>
	</Card>
	<Card class="bg-[url('/img/avatar.jpeg')] bg-cover bg-center">
	</Card>
</div>

<style>
	:global(.gradient) {
		background: rgb(34, 193, 195);
		background: linear-gradient(57deg, rgba(34, 193, 195, 1) 0%, rgba(253, 187, 45, 1) 100%);
	}
</style>
