<script>
	import ArrowButton from '$lib/ArrowButton.svelte';
import Card from '../lib/Card.svelte';
</script>

<div class="grid grid-cols-1 w-screen p-4 gap-4 md:grid-cols-10 max-w-6xl m-auto">
	<Card class="bg-gradient-to-tr from-slate-300 to-blue-200 text-gray-800 md:col-span-6">
		<h1 class="text-4xl font-bold">I'm Christian, iOS Freelancer with 6 years of experience</h1>
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
	<Card class="bg-[url('/img/avatar.jpeg')] bg-cover bg-center md:col-span-4">
	</Card>
	<Card class="bg-black md:col-span-5 text-white">
		<h2 class="text-2xl font-semibold">My Podcast</h2>
		<img class="max-h-[65%] object-contain justify-self-center place-content-center" src="img/ioob.jpg" alt="The logo of the Index out of Bounds podcast"/>
		<ArrowButton/>
	</Card>
	<Card class="bg-emerald-400 md:col-span-5 text-white bg-[url('/img/portfolio.png')] bg-contain bg-origin-padding bg-[bottom_-5rem_right_1.5rem] md:bg-[bottom_-3rem_right_1.5rem] bg-no-repeat">
		<h2 class="text-2xl font-semibold">My Portfolio</h2>
		<p>Talk is easy, action is what counts. View a list of selected projects I have been involved in.</p>
		<ArrowButton/>
	</Card>
</div>
