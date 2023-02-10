<script>
    let clazz = "";
    export { clazz as class };
</script>

<div class="bg-gray-400 h-96 md:h-[35rem] rounded-xl p-4 flex flex-col gap-4 hover:scale-[101%] transition ease-linear {clazz}">
    <slot/>
</div>