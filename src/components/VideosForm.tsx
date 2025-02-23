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
    const [progress, setProgress] = useState(0);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof VideosFormValidation>>({
        resolver: zodResolver(VideosFormValidation),
        defaultValues: {
            type: video ? video.type : "",
            videoUrl: video ? video.videoUrl : "",
        },
    });

    const uploadVideo = async (file: File, onProgress: (progress: number) => void): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("video", file);

            const xhr = new XMLHttpRequest();

            xhr.open("POST", `${GLOBAL_SERVER_URL}/upload/video`, true);

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
                    reject(new Error("Video upload failed!"));
                }
            };

            xhr.onerror = () => reject(new Error("Network error during video upload"));
            xhr.send(formData);
        });
    };

    const onSubmit = async (values: z.infer<typeof VideosFormValidation>) => {
        setIsLoading(true);
        setProgress(0);

        try {
            let videoUrl = values.videoUrl;

            if (selectedFile) {
                const uploadedUrl = await uploadVideo(selectedFile, setProgress);
                if (uploadedUrl) {
                    videoUrl = uploadedUrl;
                } else {
                    throw new Error("Video yuklashda xatolik yuz berdi.");
                }
            }

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
                setProgress(0);
            } else if (data.error) {
                toast({ title: data.error, variant: "destructive" });
            } else {
                toast({ title: "Nimadir xato, qayta urinib ko'ring", variant: "destructive" });
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
                                setProgress(0);
                                form.setValue("videoUrl", file.name);
                                form.trigger("videoUrl");
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