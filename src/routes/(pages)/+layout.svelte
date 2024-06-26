<script>
	import '../../app.postcss';
</script>

<div class="max-w-6xl m-auto w-screen p-4 bg-white md:my-4 md:rounded-xl">
	<div class="pb-4 flex gap-1 items-center">
		<div class="h-3 w-3 bg-red-600 rounded-full" />
		<div class="h-3 w-3 bg-yellow-400 rounded-full" />
		<div class="h-3 w-3 bg-green-500 rounded-full" />
		<a class="ml-auto hover:bg-black hover:text-white" href="/">The empathic dev</a>
	</div>
	<slot />

	<footer class="mt-8">
		<hr class="w-full" />
		<div class="flex mt-4">
			<a class="hover:bg-black hover:text-white" href="/imprint">Imprint</a>
		</div>
	</footer>
</div>
