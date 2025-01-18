import { VIDEO_TYPES } from "@/constants";
import { z } from "zod";

export const ProductsFormValidation = z.object({
    title: z.string().min(5, "Mahsulot nomi kamida 5 ta belgidan iborat bo'lishi kerak"),
    description: z.string().min(1, "Maydon to'ldirilishi shart"),
    imgUrl: z.string().min(1, "Maydon to'ldirilishi shart"),
});

export const VideosFormValidation = z.object({
    type: z.string().refine((value) => VIDEO_TYPES.includes(value), { message: "Video turi tanlanmagan" }),
    videoUrl: z.string().min(1, "Maydon to'ldirilishi shart"),
});