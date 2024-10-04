<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref, computed } from 'vue'
import { useVModel } from "@vueuse/core";
import { cn } from "~/lib/utils";

const props = defineProps<{
    defaultValue?: string | number
    modelValue?: string | number
    class?: HTMLAttributes['class']
    label?: string
    id?: string
    suggestions?: string[]
}>()

const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
})

const isFocused = ref(false)
const showDropdown = ref(false)

const labelClass = computed(() => {
    return {
        'active': isFocused.value || (modelValue.value && modelValue.value.toString().length > 1)
    }
})

const onFocus = () => {
    isFocused.value = true
    showDropdown.value = true
}

const onBlur = () => isFocused.value = false

const filteredSuggestions = computed(() => {
    if (!props.suggestions || !modelValue.value) return []
    return props.suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(modelValue.value.toString().toLowerCase())
    )
})

const selectSuggestion = (suggestion: string) => {
    modelValue.value = suggestion
    showDropdown.value = false
}

const handleDocumentClick = (event: MouseEvent) => {
    const dropdownElement = document.querySelector('.dropdown')
    if (dropdownElement && !dropdownElement.contains(event.target as Node)) showDropdown.value = false
}

onMounted(() => document.addEventListener('click', handleDocumentClick))
onUnmounted(() => document.removeEventListener('click', handleDocumentClick))
</script>

<template>
    <div class="relative">
        <input
            v-model="modelValue"
            :id="id"
            :class="cn('flex text-[#174B7C] !text-[18px] !h-[64px] w-full rounded-md border border-input bg-background px-5 pt-6 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50', props.class)"
            @focus="onFocus"
            @blur="onBlur"
        >
        <label
            @focus="onFocus"
            @blur="onBlur"
            :for="id"
            :class="['text-[14px] text-[#174B7C] absolute transition duration-500 -translate-y-1/2 top-1/2 left-5', labelClass]"
        >
            {{ label }}
        </label>
        <transition name="fade">
            <div
                v-if="showDropdown && filteredSuggestions.length > 0"
                class="dropdown absolute z-10 mt-2 w-full bg-white flex flex-col border border-gray-300 rounded-md shadow-lg"
            >
                <button
                    v-for="(suggestion, index) in filteredSuggestions"
                    :key="index"
                    @click.stop.prevent="selectSuggestion(suggestion)"
                    class="px-4 py-2 cursor-pointer text-left border-b border-b-slate-200 hover:bg-gray-100"
                >
                    {{ suggestion }}
                </button>
            </div>
        </transition>
    </div>
</template>

<style scoped>
label {
    transition: .3s ease-in-out;
}

.active {
    top: 20px;
    left: 20px;
}

.fade-enter-active, .fade-leave-active {
    transition: .3s ease;
}

.fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>