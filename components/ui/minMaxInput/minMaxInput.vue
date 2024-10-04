<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
    min: number;
    max: number;
    modelValue: { minValue: number; maxValue: number };
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: { minValue: number; maxValue: number }): void;
}>();

const minValue = ref<number>(Number(props.modelValue.minValue));
const maxValue = ref<number>(Number(props.modelValue.maxValue));

const minError = computed(() => {
    if (minValue.value < props.min) {
        return `Минимальное значение не должно быть меньше ${props.min}`;
    }
    return '';
});

const maxError = computed(() => {
    if (maxValue.value > props.max) {
        return `Максимальное значение не должно быть больше ${props.max}`;
    }
    return '';
});

const rangeError = computed(() => {
    if (minValue.value > maxValue.value) {
        return 'Минимальное значение не может быть больше максимального';
    }
    return '';
});

watch([minValue, maxValue], ([newMinValue, newMaxValue]) => {
    if(minValue.value === '') minValue.value = 0
    if(maxValue.value === '') minValue.value = 0
    emit('update:modelValue', { minValue: newMinValue, maxValue: newMaxValue });
});
</script>

<template>
    <div class="flex gap-4 items-center relative">
        <div class="w-full relative">
            <span class="absolute left-5 text-[14px] text-[#174B7C] top-1/2 -translate-y-1/2">от</span>
            <input
                v-model="minValue"
                type="number"
                class="rounded-md border border-input bg-background !h-[64px] text-sm text-right text-[#174B7C] !text-[18px] w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            />
            <p v-if="minError" class="absolute text-red-500 text-xs italic">{{ minError }}</p>
        </div>
        <div class="w-full relative">
            <span class="absolute left-5 text-[14px] text-[#174B7C] top-1/2 -translate-y-1/2">до</span>
            <input
                v-model="maxValue"
                type="number"
                class="rounded-md border border-input bg-background !h-[64px] text-sm text-right text-[#174B7C] !text-[18px] w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            />
            <p v-if="maxError" class="absolute text-red-500 text-xs italic">{{ maxError }}</p>
        </div>
    </div>
    <p v-if="rangeError" class="text-red-500 text-xs italic">{{ rangeError }}</p>
</template>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>