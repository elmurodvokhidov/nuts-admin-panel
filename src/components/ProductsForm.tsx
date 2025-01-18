"use client";

import CustomFormField from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FormFieldType, GLOBAL_SERVER_URL } from "@/constants";
import { ProductsFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import ImageUploader from "./ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { reloadPage } from "@/lib/utils";

export default function ProductsForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof ProductsFormValidation>>({
        resolver: zodResolver(ProductsFormValidation),
        defaultValues: {
            title: "",
            description: "",
            imgUrl: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof ProductsFormValidation>) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${GLOBAL_SERVER_URL}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                reloadPage();
                setOpen && setOpen(false);
                form.reset();
            } else {
                toast({ title: "Nimadir xato, qayta urinib ko'ring" });
            }
        } catch (error) {
            console.log(error);
            toast({ title: "Mahsulot qo'shishda xatolik." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="default-btn">
                <Plus />
                Qo'shish
            </SheetTrigger>
            <SheetContent className="!w-full sm:!max-w-md h-screen px-3 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        Mahsulot ma'lumotlari
                    </SheetTitle>
                </SheetHeader>

                <Separator className="my-4 bg-light-200/50" />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                        <CustomFormField
                            control={form.control}
                            fieldType={FormFieldType.INPUT}
                            name="title"
                            label="Sarlavha"
                            placeholder="Mahsulot nomi"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="description"
                            label="Mahsulot tavsifi"
                            placeholder="Mahsulot haqida qisqacha yozing"
                        />

                        <div>
                            <ImageUploader onUpload={(url) => {
                                form.setValue("imgUrl", url);
                                form.trigger("imgUrl");
                            }} />

                            {form.formState.errors.imgUrl && (
                                <p className="text-red-500 text-[0.8rem] font-medium text-destructive mt-2">
                                    {form.formState.errors.imgUrl.message}
                                </p>
                            )}
                        </div>

                        <SheetFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Yuklanmoqda..." : "Qo'shish"}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}