<script>
    let clazz = "";
    export { clazz as class };
</script>

<div class="bg-red-500 h-96 rounded-xl p-4 flex flex-col gap-4 {clazz}">
    <slot/>
</div>