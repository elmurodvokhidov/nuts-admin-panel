import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileIcon } from "lucide-react";
import { useState } from "react";

export default function VideoUploader({ onFileSelect }: { onFileSelect: (file: File) => void; }) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    return (
        <div className="space-y-4">
            <Label
                htmlFor="file"
                className="border-2 border-dashed border-dark-500 rounded-lg flex flex-col gap-1 p-6 items-center"
            >
                {selectedFile ? (
                    <span className="text-sm font-medium text-gray-500">
                        {selectedFile.name}
                    </span>
                ) : (
                    <>
                        <FileIcon className="w-12 h-12" />
                        <span className="text-sm font-medium text-gray-500">
                            Click to browse
                        </span>
                        <span className="text-xs text-gray-500">MP4, AVI, or MKV</span>
                    </>
                )}
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