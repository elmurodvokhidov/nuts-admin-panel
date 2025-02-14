import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { VideosFormValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import VideoUploader from "./VideoUploader";
import CustomFormField from "./CustomFormField";
import { FormFieldType, GLOBAL_SERVER_URL, VIDEO_TYPES } from "@/constants";
import { SelectItem } from "./ui/select";
import { useToast } from "@/hooks/use-toast";
import { Video } from "@/routes/Videos";

interface VideosFormProps {
    video?: Video;
    isEdit: boolean;
    buttonVariant: string;
    icon: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    fetchAllVideos: () => void;
}

export default function VideosForm({
    video,
    isEdit,
    buttonVariant,
    icon,
    open,
    setOpen,
    fetchAllVideos,
}: VideosFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof VideosFormValidation>>({
        resolver: zodResolver(VideosFormValidation),
        defaultValues: {
            type: video ? video.type : "",
            videoUrl: video ? video.videoUrl : "",
        },
    });

    const uploadVideo = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("video", file);

        try {
            const response = await fetch(`${GLOBAL_SERVER_URL}/upload/video`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Video upload failed!");

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Video yuklashda xatolik:", error);
            toast({ title: "Video yuklashda xatolik.", variant: "destructive" });
            return null;
        }
    };

    const onSubmit = async (values: z.infer<typeof VideosFormValidation>) => {
        setIsLoading(true);

        try {
            let videoUrl = values.videoUrl;

            // Fayl yuklash
            if (selectedFile) {
                const uploadedUrl = await uploadVideo(selectedFile);
                if (uploadedUrl) {
                    videoUrl = uploadedUrl;
                } else {
                    throw new Error("Video yuklashda xatolik yuz berdi.");
                }
            }

            // Ma'lumotlarni serverga yuborish
            const endpoint = isEdit && video ? `/videos/${video._id}` : "/videos";
            const method = isEdit ? "PUT" : "POST";

            const response = await fetch(`${GLOBAL_SERVER_URL}${endpoint}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, videoUrl }),
            });

            const data = await response.json();

            if (response.ok) {
                fetchAllVideos();
                setOpen && setOpen(false);
                form.reset();
            } else if (data.error) {
                toast({ title: data.error, variant: "destructive" });
            } else {
                toast({
                    title: "Nimadir xato, qayta urinib ko'ring",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Video qo'shishda xatolik.", variant: "destructive" });
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
                    <SheetTitle>Video ma'lumotlari</SheetTitle>
                </SheetHeader>

                <Separator className="my-4 bg-light-200/50" />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="type"
                            label="Turi"
                            placeholder="Video turini tanlang"
                        >
                            {VIDEO_TYPES.map((type, i) => (
                                <SelectItem key={type + i} value={type}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <p>{type}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormField>

                        <div>
                            <VideoUploader onFileSelect={(file) => {
                                setSelectedFile(file);
                                form.setValue("videoUrl", file.name);
                                form.trigger("videoUrl");
                            }} />

                            {form.formState.errors.videoUrl && (
                                <p className="text-red-500 text-[0.8rem] font-medium text-destructive mt-2">
                                    {form.formState.errors.videoUrl.message}
                                </p>
                            )}
                        </div>

                        <SheetFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? "Yuklanmoqda..."
                                    : !isEdit
                                        ? "Qo'shish"
                                        : "Tahrirlash"}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}