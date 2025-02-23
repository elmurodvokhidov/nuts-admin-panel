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
    const [progress, setProgress] = useState(0);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof ProductsFormValidation>>({
        resolver: zodResolver(ProductsFormValidation),
        defaultValues: {
            title: product ? product.title : "",
            description: product ? product.description : "",
            imgUrl: product ? product.imgUrl : "",
        },
    });

    const uploadImage = async (file: File, onProgress: (progress: number) => void): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("image", file);

            const xhr = new XMLHttpRequest();

            xhr.open("POST", `${GLOBAL_SERVER_URL}/upload/image`, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentCompleted = Math.round((event.loaded * 100) / event.total);
                    onProgress(percentCompleted);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 201) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (error) {
                        reject(new Error("JSON parse error"));
                    }
                } else {
                    reject(new Error("Image upload failed!"));
                }
            };

            xhr.onerror = () => reject(new Error("Network error during image upload"));
            xhr.send(formData);
        });
    };

    const onSubmit = async (values: z.infer<typeof ProductsFormValidation>) => {
        setIsLoading(true);
        setProgress(0);

        try {
            let imageUrl = product && !selectedImage ? product.imgUrl : "";

            if (selectedImage) {
                const uploadedUrl = await uploadImage(selectedImage, setProgress);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                } else {
                    throw new Error("Rasm yuklashda xatolik yuz berdi.");
                }
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
                setProgress(0);
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
                            <ImageUploader onSelect={(file) => {
                                setSelectedImage(file);
                                form.setValue("imgUrl", file.name);
                                form.trigger("imgUrl");
                            }} />

                            {progress !== 0 && (
                                <div className="mt-2 w-full bg-gray-200 rounded-full">
                                    <div
                                        className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded-full"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <span>{progress}%</span>
                                    </div>
                                </div>
                            )}

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