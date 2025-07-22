import z from 'zod'

export const createtaskSchema = z.object({

    title: z.string({

        required_error: 'title is required',
    }),

    description: z.string({

        required_error: 'description is require',
    }),
    date: z.string().datetime().optional(),
})