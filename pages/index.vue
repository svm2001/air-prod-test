<script setup lang="ts">

</script>

<template>
    <div class="min-h-screen max-h-screen flex items-center justify-center">
        <Dialog>
            <DialogTrigger as-child>
                <Button>Стать резидентом</Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[800px] overflow-auto dialog">
                <ResidentForm />
            </DialogContent>
        </Dialog>
    </div>
</template>

<style>
.dialog {
    max-height: calc(100% - 100px);
}

@media (max-width: 640px) {
    .dialog {
        max-height: calc(100% - 30px);

    }
}
</style>