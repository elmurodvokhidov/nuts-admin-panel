import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileIcon } from "lucide-react";
import { useState } from "react";

export default function ImageUploader({ onSelect }: { onSelect: (file: File) => void }) {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setPreview(URL.createObjectURL(file));
            onSelect(file);
        }
    };

    return (
        <div className="space-y-4">
            <Label htmlFor="file" className="border-2 border-dashed border-dark-500 rounded-lg flex flex-col gap-1 p-6 items-center">
                {preview ? (
                    <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                ) : (
                    <FileIcon className="w-12 h-12" />
                )}
                <span className="text-sm font-medium text-gray-500">Click to browse</span>
                <span className="text-xs text-gray-500">JPG, PNG, or GIF</span>
            </Label>
            <div className="space-y-2 text-sm">
                <Label htmlFor="file" className="shad-input-label">
                    Rasm yuklang
                </Label>
                <Input
                    id="file"
                    type="file"
                    accept="image/jpeg, image/png, image/gif"
                    className="shad-input"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    )
}