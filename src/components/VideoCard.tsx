import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Edit, Trash } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { Video } from "@/routes/Videos";
import { GLOBAL_SERVER_URL } from "@/constants";
import { reloadPage } from "@/lib/utils";

export default function VideoCard({ video }: { video: Video }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await fetch(`${GLOBAL_SERVER_URL}/videos/${video._id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) return reloadPage();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Card className="w-[300px] group relative space-y-4 overflow-hidden">
                <div className="group-hover:opacity-90">
                    <video
                        src={video.videoUrl}
                        loop
                        muted
                        autoPlay
                        className="aspect-square w-full object-cover"
                    />
                </div>
                <CardContent className="px-4 py-0">
                    <h3 className="text-lg uppercase">{video.type}</h3>
                </CardContent>
                <CardFooter className="p-0 border-t">
                    <Button variant="ghost" className="w-full">
                        <Edit className="size-4 me-1" /> Tahrirlash
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full text-red-500 hover:text-red-600"
                        onClick={() => setModalOpen(true)}
                    >
                        <Trash className="size-4 me-1" /> O'chirish
                    </Button>
                </CardFooter>
            </Card>

            <ConfirmModal
                open={isModalOpen}
                setOpen={setModalOpen}
                title="Videoni o'chirish"
                description="Ushbu videoni o'chirishni xohlaysizmi? Bu amalni keyin qaytarib bo'lmaydi."
                onConfirm={handleDelete}
            />
        </>
    );
}