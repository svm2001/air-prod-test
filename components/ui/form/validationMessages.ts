export const validationMessages = {
    required: "Обязательно поле",
    phoneFormat: "Неверный формат телефона",
    minLength: (min: number) => `Длина поля должна быть минимум ${min} символа`,
    maxLength: (max: number) => `Максимальная длина ${max} символов`,
};