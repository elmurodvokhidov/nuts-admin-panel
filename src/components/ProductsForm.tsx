import CustomFormField from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FormFieldType, GLOBAL_SERVER_URL } from "@/constants";
import { ProductsFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import ImageUploader from "./ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/routes/Products";

interface ProductsFormProps {
    product?: Product;
    isEdit: boolean;
    buttonVariant: string;
    icon: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    fetchAllProducts: () => void;
}

export default function ProductsForm({
    product,
    isEdit,
    buttonVariant,
    icon,
    open,
    setOpen,
    fetchAllProducts,
}: ProductsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const form = useForm<z.infer<typeof ProductsFormValidation>>({
        resolver: zodResolver(ProductsFormValidation),
        defaultValues: {
            title: product ? product.title : "",
            description: product ? product.description : "",
            imgUrl: product ? product.imgUrl : "",
        },
    });

    const onSubmit = async (values: z.infer<typeof ProductsFormValidation>) => {
        setIsLoading(true);
        try {
            let imageUrl = "";
            if (selectedImage) {
                const formData = new FormData();
                formData.append("image", selectedImage);

                const imageResponse = await fetch(`${GLOBAL_SERVER_URL}/upload/image`, {
                    method: "POST",
                    body: formData,
                });

                if (!imageResponse.ok) throw new Error("Rasm yuklashda xatolik yuz berdi!");
                imageUrl = await imageResponse.json();
            }

            const productData = { ...values, imgUrl: imageUrl };

            const response = await fetch(
                isEdit && product ? `${GLOBAL_SERVER_URL}/products/${product._id}` : `${GLOBAL_SERVER_URL}/products`,
                {
                    method: isEdit ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData),
                }
            );

            if (response.ok) {
                fetchAllProducts();
                setOpen && setOpen(false);
                form.reset();
            } else {
                toast({ title: "Nimadir xato, qayta urinib ko'ring", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Mahsulot qo'shishda xatolik.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className={buttonVariant}>
                <img src={`assets/${icon}.svg`} className="size-4" />
                {!isEdit ? "Qo'shish" : "Tahrirlash"}
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
                            <ImageUploader onSelect={(file) => setSelectedImage(file)} />

                            {form.formState.errors.imgUrl && (
                                <p className="text-red-500 text-[0.8rem] font-medium text-destructive mt-2">
                                    {form.formState.errors.imgUrl.message}
                                </p>
                            )}
                        </div>

                        <SheetFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Yuklanmoqda..." : !isEdit ? "Qo'shish" : "Tahrirlash"}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}