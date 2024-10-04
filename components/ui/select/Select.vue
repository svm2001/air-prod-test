<template>
    <div class="relative" ref="dropdownRef">
        <div>
            <button
                type="button"
                class="flex justify-between items-center px-5 w-full rounded-md border border-input bg-background bg-white !h-[64px] hover:bg-gray-50 focus:outline-none"
                @click="toggleDropdown"
            >
                <div class="flex flex-col items-start">
                    <div class="text-[14px] text-[#174B7C]">{{ title }}</div>
                    <div class="text-[#174B7C] !text-[18px] text-ellipsis whitespace-nowrap max-w-[650px] overflow-hidden max-sm:max-w-[250px]">{{ selectedLabel }}</div>
                </div>
                <svg :class="{ 'arrow-up': isOpen }" class="-mr-1 transition duration-300 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill="#174B7C" fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
            </button>
        </div>

        <div
            v-if="isOpen"
            class="origin-top-right w-full absolute z-10 right-0 mt-2 border border-input rounded-md shadow-lg bg-white"
            tabindex="-1"
        >
            <div class="py-1 max-h-[155px] overflow-auto" role="none">
                <template v-for="(option, index) in options" :key="index">
                    <div
                        class="text-gray-700 flex items-center transition hover:bg-gray-50 px-4 py-2 text-sm cursor-pointer"
                        @click="selectOption(option)"
                    >
                        <input
                            v-if="multiple"
                            type="checkbox"
                            class="mr-2 custom-checkbox"
                            :checked="isSelected(option)"
                            @change="toggleOption(option)"
                        />
                        {{ option.label }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface DropdownOption {
    value: string | number;
    label: string;
}

const props = defineProps<{
    title?: string
    options: DropdownOption[]
    multiple?: boolean
    modelValue: DropdownOption | DropdownOption[]
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: DropdownOption | DropdownOption[]): void;
}>();

const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);

const selectedLabel = computed(() => {
    if (props.multiple) {
        const selectedOptions = Array.isArray(props.modelValue) ? props.modelValue : [];
        return selectedOptions.length ? selectedOptions.map((opt) => opt.label).join(', ') : 'Выберите...';
    } else {
        const selectedOption = props.modelValue as DropdownOption;
        return selectedOption ? selectedOption.label : 'Выберите...';
    }
});

const toggleDropdown = () => isOpen.value = !isOpen.value;

const selectOption = (option: DropdownOption) => {
    if (props.multiple) {
        toggleOption(option);
    } else {
        emit('update:modelValue', option);
        isOpen.value = false;
    }
};

const toggleOption = (option: DropdownOption) => {
    const currentValue = Array.isArray(props.modelValue) ? props.modelValue : [];
    const newValue = currentValue.some((val) => val.value === option.value)
        ? currentValue.filter((val) => val.value !== option.value)
        : [...currentValue, option];
    emit('update:modelValue', newValue);
};

const isSelected = (option: DropdownOption) => {
    const currentValue = Array.isArray(props.modelValue) ? props.modelValue : [];
    return currentValue.some((val) => val.value === option.value);
};

const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) isOpen.value = false;
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
.arrow-up {
    transform: rotate(180deg);
}

.custom-checkbox {
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #174B7C;
    border-radius: 0.25rem;
    margin-right: 0.5rem;
    position: relative;
}

.custom-checkbox:checked::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0.75rem;
    height: 0.75rem;
    background-color: #174B7C;
    border-radius: 0.125rem;
}
</style>