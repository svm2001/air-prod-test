<script setup lang="ts">
import { RangeCalendar } from '@/components/ui/range-calendar'
import { getLocalTimeZone, today } from '@internationalized/date'

const start = today(getLocalTimeZone())
const end = start.add({ days: 7 })

const calendarValue = ref({ start, end })

const isOpen = ref(false)

const openCalendar = () => {
    isOpen.value = true
}

const closeCalendar = () => {
    isOpen.value = false
}
</script>

<template>
    <div>
        <Popover v-model:open="isOpen">
            <div class="flex gap-4 relative">
                <span class="absolute left-5 text-[14px] text-[#174B7C] top-1/2 -translate-y-1/2">c</span>
                <span class="absolute right-[44%] text-[14px] text-[#174B7C] top-1/2 -translate-y-1/2 max-sm:right-[38%]">по</span>
                <PopoverTrigger as-child>
                    <input
                        type="text"
                        class="rounded-md border border-input bg-background !h-[64px] text-sm text-right text-[#174B7C] !text-[18px] w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        :value="calendarValue.start?.toString()"
                        @click="openCalendar"
                        readonly
                    />
                </PopoverTrigger>
                <PopoverTrigger as-child>
                    <input
                        type="text"
                        class="rounded-md border border-input bg-background !h-[64px] text-sm text-right text-[#174B7C] !text-[18px] w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        :value="calendarValue.end?.toString()"
                        @click="openCalendar"
                        readonly
                    />
                </PopoverTrigger>
            </div>
            <PopoverContent class="p-0">
                <RangeCalendar v-model="calendarValue" class="rounded-md border" />
            </PopoverContent>
        </Popover>
    </div>
</template>