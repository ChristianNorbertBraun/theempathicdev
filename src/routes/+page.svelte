<script>
	import ArrowButton from '$lib/ArrowButton.svelte';
	import Card from '../lib/Card.svelte';
</script>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-10">
		<Card class="bg-gradient-to-tr from-slate-300 to-blue-200 text-gray-800 md:col-span-6">
			<h1 class="text-4xl font-bold">I'm Christian, iOS Freelancer with 6 years of experience</h1>
			<p>
				I care a lot about human friendly interface design and excellent code quality. Don’t take my
				word for it, check out my portfolio.
			</p>
			<div class="mt-auto flex items-center">
				<a
					class="bg-emerald-400 text-gray-100  px-4 py-2 rounded-full text-lg hover:bg-gradient-to-tr hover:from-[#7B02FC] hover:to-[#F402D3]"
					href="mailto:christian.braun@theempathicdev.de">Contact me</a
				>
				<div class="ml-4 flex gap-2 h-full">
					<a
						class="bg-gray-400 text-gray-100 flex justify-center items-center h-full aspect-square  rounded-full text-lg hover:bg-gradient-to-tr hover:from-[#7B02FC] hover:to-[#F402D3]"
						href="https://twitter.com/NorbiBraun">
						<img class="w-5" src="/img/twitter.svg" alt="Twitter logo"/>
					</a>
					
					<a
						class="bg-gray-400 text-gray-100 flex justify-center items-center h-full aspect-square rounded-full text-lg hover:bg-gradient-to-tr hover:from-[#7B02FC] hover:to-[#F402D3]"
						href="https://github.com/ChristianNorbertBraun">
						<img class="w-5" src="/img/github.svg" alt="Github logo"/>
						</a
					>
				</div>
			</div>
		</Card>
		<Card class="bg-[url('/img/avatar.webp')] bg-cover bg-center md:col-span-4 h-96" />
		<Card class="bg-black md:col-span-5 text-white h-96">
			<h2 class="text-2xl font-semibold">My Podcast</h2>
			<img
				class="max-h-[65%] object-contain justify-self-center place-content-center"
				src="img/ioob.webp"
				alt="The logo of the Index out of Bounds podcast"
			/>
			<ArrowButton link="https://anchor.fm/indexoutofbounds" />
		</Card>
		<Card
			class="bg-[#95B39D] md:col-span-5 h-96 text-white bg-[url('/img/portfolio.webp')] bg-contain bg-origin-padding bg-[bottom_-5rem_right_1.5rem] md:bg-[bottom_-3rem_right_1.5rem] bg-no-repeat"
		>
			<h2 class="text-2xl font-semibold">My Portfolio</h2>
			<p>
				Talk is easy, action is what counts. View a list of selected projects I have been involved
				in.
			</p>
			<ArrowButton link="/pdf/portfolio_tac.pdf" />
		</Card>
	</div>