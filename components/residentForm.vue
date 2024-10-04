<script setup lang="ts">
import { ref } from 'vue';
import Select from "~/components/ui/select/Select.vue";
import minMaxInput from "~/components/ui/minMaxInput/minMaxInput.vue";
import DateRangePicker from "~/components/ui/range-calendar/DateRangePicker.vue";
import { useForm, useField } from "vee-validate";
import { formValidation } from "~/components/ui/form/validation";
import { vMaska } from "maska/vue";
import { PhonePattern } from "~/components/ui/input";
import axios from 'axios';

const organizationSuggestions = ['ООО «Абсолют»', 'ООО «Промышленность»', 'ЗАО «Вымпел»', 'ПАО «Ветер»', 'ИП «Иванов»'];
const addressSuggestions = ['г. Москва, ул. Петров д.1, кв.2', 'г. Санкт-Петербург, ул. Иванова д.2, кв.22', 'г. Новосибирск, ул. Свердлова д.3, кв.33'];

const options = [
    { value: 1, label: 'Производственная площадь' },
    { value: 2, label: 'Производственная площадь 2' },
    { value: 3, label: 'Производственная площадь 3' },
    { value: 4, label: 'Производственная площадь 4' },
    { value: 5, label: 'Производственная площадь 5' },
];


const { handleSubmit, errors } = useForm({
    validationSchema: formValidation,
});

const { value: name } = useField('name');
const { value: phone } = useField('phone');
const { value: address } = useField('address');
const { value: singleSelect } = useField('singleSelect');
const { value: multipleSelect } = useField('multipleSelect');
const { value: minMax } = useField('minMax', undefined, { initialValue: { minValue: 120, maxValue: 400 } });
const { value: dateRange } = useField('dateRange', undefined, { initialValue: { from: new Date(), to: new Date() } });

const selectedSingle = ref<{ value: number; label: string } | null>(null);
const selectedMultiple = ref<string[]>([]);

const submit = async (values: any) => {
    try {
        let formData = new FormData();
        const multipleSelectLabels = values.multipleSelect.map((option: { label: string }) => option.label);

        formData.append('Наименование организации', values.name);
        formData.append('Телефон', values.phone);
        formData.append('Адрес', values.address);
        formData.append('Тип помещения (одиночный выбор)', JSON.stringify(values.singleSelect.label));
        formData.append('Тип помещения (множественный выбор)', JSON.stringify(multipleSelectLabels));
        formData.append('Площадь помещения от', Number(values.minMax.minValue));
        formData.append('Площадь помещения до', Number(values.minMax.maxValue));
        formData.append('Дата начала аренды', values.dateRange.from.toISOString().split('T')[0]);
        formData.append('Дата окончания аренды', values.dateRange.to.toISOString().split('T')[0]);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const response = await axios.post('/api-endpoint', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Ответ от сервера:', response.data);
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
    }
};

const onSubmit = handleSubmit((values: any) => submit(values));
</script>

<template>
    <form @submit="onSubmit">
        <h2 class="text-[#1A263D] text-[24px] font-[600] mb-10 max-sm:text-[18px] max-sm:mb-4">Заполните заявку, чтобы стать резидентом</h2>
        <div class="flex flex-col gap-5">
            <FormField v-slot="{ componentField }" name="name">
                <FormItem>
                    <FormControl>
                        <Input
                            id="name"
                            label="Наименование организации / ИП"
                            :suggestions="organizationSuggestions"
                            v-bind="componentField"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="phone">
                <FormItem>
                    <FormControl>
                        <Input
                            id="phone"
                            label="Контактный телефон"
                            v-maska="PhonePattern"
                            v-bind="componentField"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="address">
                <FormItem>
                    <FormControl>
                        <Input
                            id="address"
                            label="Адрес"
                            :suggestions="addressSuggestions"
                            v-bind="componentField"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="singleSelect">
                <FormItem>
                    <FormControl>
                        <Select
                            title="Тип помещения (единичный выбор)"
                            v-model="selectedSingle"
                            :options="options"
                            v-bind="componentField"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="multipleSelect">
                <FormItem>
                    <FormControl>
                        <Select
                            title="Тип помещения (множественный выбор)"
                            v-model="selectedMultiple"
                            :options="options"
                            :multiple="true"
                            v-bind="componentField"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <div class="text-[#174B7C] text-[14px]">Площадь помещения (м<sup>2</sup>)</div>
            <FormField v-slot="{ componentField }" name="minMax">
                <FormItem>
                    <FormControl>
                        <minMaxInput
                            :min="120"
                            :max="400"
                            v-model="minMax"
                            v-bind="componentField"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <div class="text-[#174B7C] text-[14px]">Дата начала аренды</div>
            <FormField v-slot="{ componentField }" name="dateRange">
                <FormItem>
                    <FormControl>
                        <DateRangePicker
                            v-model="dateRange"
                            v-bind="componentField"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
        </div>
        <div class="flex justify-center mt-4">
            <button type="submit" class="w-fit m-auto mt-5 bg-[#174B7C] text-white transition hover:opacity-90 rounded-full px-8 py-2">Отправить</button>
        </div>
    </form>
</template>