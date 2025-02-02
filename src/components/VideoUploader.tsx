import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileIcon, LoaderCircle } from "lucide-react"
import { GLOBAL_SERVER_URL } from "@/constants";
import { useState } from "react";

export default function VideoUploader({ onUpload }: { onUpload: (url: string) => void }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("video", e.target.files[0]);

            try {
                const response = await fetch(`${GLOBAL_SERVER_URL}/upload/video`, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) throw new Error("Video upload failed!");

                const videoUrl = await response.json();
                onUpload(videoUrl);
            } catch (error) {
                console.error("Video yuklashda xatolik:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="space-y-4">
            <Label htmlFor="file" className="border-2 border-dashed border-dark-500 rounded-lg flex flex-col gap-1 p-6 items-center">
                {isLoading ? <LoaderCircle className="w-12 h-12 animate-spin" /> : <FileIcon className="w-12 h-12" />}
                <span className="text-sm font-medium text-gray-500">Drag and drop a file or click to browse</span>
                <span className="text-xs text-gray-500">MP4, AVI, or MKV</span>
            </Label>
            <div className="space-y-2 text-sm">
                <Label htmlFor="file" className="shad-input-label">
                    Video yuklang
                </Label>
                <Input
                    id="file"
                    type="file"
                    placeholder="File"
                    accept="video/mp4, video/x-msvideo, video/x-matroska"
                    className="shad-input"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    )
}