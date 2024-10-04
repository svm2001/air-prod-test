import * as z from "zod";

export const PhoneRegex = z
    .string()
    .regex(/^\+7 \d{3} \d{3} \d{2} \d{2}$/, "Неверный формат телефона");