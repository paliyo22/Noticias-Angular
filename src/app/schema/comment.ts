import { object, optional, string, nullable, date, number, InferInput, safeParse } from "valibot";


const commentSchema = object({
    id: optional(string()),
    news_id: optional(nullable(string())),
    user_id: string(),
    parent_comment_id: optional(nullable(string())),
    content: string(),
    created: optional(date())
});

const commentOutput = object({
    ...commentSchema.entries,
    likes: number(),
    replies: number(),
    username: string()
})
export type CommentInput = InferInput<typeof commentSchema>

export type CommentOutput = InferInput<typeof commentOutput> 

export const validateCommentInput = (imput: unknown) => {
    return safeParse(commentSchema, imput)
};
