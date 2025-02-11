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
    const { toast } = useToast();

    const form = useForm<z.infer<typeof VideosFormValidation>>({
        resolver: zodResolver(VideosFormValidation),
        defaultValues: {
            type: video ? video.type : "",
            videoUrl: video ? video.videoUrl : "",
        },
    })

    const onSubmit = async (values: z.infer<typeof VideosFormValidation>) => {
        setIsLoading(true);
        try {
            if (!isEdit && !video) {
                const response = await fetch(`${GLOBAL_SERVER_URL}/videos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (response.ok) {
                    fetchAllVideos();
                    setOpen && setOpen(false);
                    form.reset();
                } else if (data.error) {
                    toast({ title: data.error, variant: "destructive" });
                } else {
                    toast({ title: "Nimadir xato, qayta urinib ko'ring", variant: "destructive" });
                }
            } else {
                const response = await fetch(`${GLOBAL_SERVER_URL}/videos/${video?._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });

                if (response.ok) {
                    fetchAllVideos();
                    setOpen && setOpen(false);
                    form.reset();
                } else {
                    toast({ title: "Nimadir xato, qayta urinib ko'ring", variant: "destructive" });
                }
            }
        } catch (error) {
            console.log(error);
            toast({ title: "Video qo'shishda xatolik.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className={buttonVariant}>
                <img src={`assets/${icon}.svg`} className="size-4" />
                {!isEdit ? "Qo'shish" : "Tahrirlash"}
            </SheetTrigger>
            <SheetContent className="!w-full sm:!max-w-md h-screen px-3 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        Video ma'lumotlari
                    </SheetTitle>
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
                            <VideoUploader onUpload={(url) => {
                                form.setValue("videoUrl", url);
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
                                {isLoading ? "Yuklanmoqda..." : !isEdit ? "Qo'shish" : "Tahrirlash"}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}