import { boolean, date, enum_, InferInput, nullable, number, object, optional, string, union } from "valibot";
import { Category } from "../src/app/enum/category";

const newsSchema = object({
    timestamp: union([string(), date()]),
    title: string(),
    snippet: string(),
    newsUrl: string(),
    publisher: string(),
    image_url: optional(nullable(string())),
    hasSubnews: boolean(),
    id: string(), //campo de salida
    likes: optional(number()), // campo de salida
    is_active: optional(boolean()), // campo de salida
    total: optional(number()),
    category: optional(enum_(Category)) // campo de salida
});

export type NewsOutput = InferInput<typeof newsSchema> 