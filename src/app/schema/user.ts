import { string, email, minLength, object, date, toMaxValue, optional, boolean, maxValue, enum_, uuid, pipe, InferInput, partial, safeParse } from "valibot";
import { Role } from "../enum/role";

const emailSchema = pipe(string(), email());
const passwordSchema = pipe(string(), minLength(6));

const sessionSchema = object({
    username: pipe(string(), minLength(4)),
    role: enum_(Role),
})

const userSchema = object({
    name: string(),
    lastname: string(),
    birthday: pipe(date(), toMaxValue(new Date())),
    subscription: boolean(),
    email: emailSchema,
    password: optional(passwordSchema),
    ...sessionSchema.entries
})

const authSchema = object({
    email: emailSchema,
    password: passwordSchema
})

const userOutputSchema = object({
    id: optional(pipe(string(), uuid())),
    created: pipe(date(), maxValue(new Date())),
    is_active: optional(boolean()),
    ...userSchema.entries,
})

export type Session = InferInput<typeof sessionSchema>

export type UserOutput = InferInput<typeof userOutputSchema>

export type AuthInput = InferInput<typeof authSchema>

export type UserInput = InferInput<typeof userSchema>

export const validateImputUser = (input: unknown) => {
    return safeParse(userSchema, input)
} 

export const validateOutputUser = (input: unknown) => {
    return safeParse(userOutputSchema, input)
} 

export const validatePartialUser = (input: unknown) => {
    return safeParse(partial(userSchema), input)
}

export const validateAuth = (input: unknown) => {
    return safeParse(authSchema, input)
}

export const validatePassword = (input: unknown) => {
    return safeParse(passwordSchema, input);
}