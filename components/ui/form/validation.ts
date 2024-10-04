import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { validationMessages } from "~/components/ui/form/validationMessages";
import { PhoneRegex } from "~/components/ui/form/validationRegExp";

export const formValidation = toTypedSchema(
    z.object({
        name: z
            .string({ required_error: validationMessages.required })
            .min(3, validationMessages.minLength(3))
            .max(70, validationMessages.maxLength(70)),
        phone: z
            .string({ required_error: validationMessages.required })
            .refine((value) => PhoneRegex.safeParse(value).success, {
                message: validationMessages.phoneFormat,
            }),
        address: z
            .string({ required_error: validationMessages.required })
            .min(3, validationMessages.minLength(3))
            .max(70, validationMessages.maxLength(70)),
        singleSelect: z
            .object({
                value: z.string().or(z.number()),
                label: z.string(),
            }, { required_error: validationMessages.required })
            .nullable()
            .refine((value) => value !== null, {
                message: validationMessages.required,
            }),
        multipleSelect: z
            .array(
                z.object({
                    value: z.string().or(z.number()),
                    label: z.string(),
                }, { required_error: validationMessages.required })
            )
            .nullable()
            .refine((value) => value !== null && value.length > 0, {
                message: validationMessages.required,
            }),
        minMax: z.object({
            minValue: z
                .number({ required_error: validationMessages.required }),
            maxValue: z
                .number({ required_error: validationMessages.required })
        }),
        dateRange: z.object({
            from: z.date({ required_error: validationMessages.required }),
            to: z.date({ required_error: validationMessages.required }),
        }),
    })
);