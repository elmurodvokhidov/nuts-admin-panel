import VideoCard from "@/components/VideoCard";
import VideosForm from "@/components/VideosForm";
import { GLOBAL_SERVER_URL } from "@/constants";
import { useEffect, useState } from "react";

export interface Video {
    _id: string;
    type: string;
    videoUrl: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export default function Videos() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [videos, setVideos] = useState<Video[]>([]);

    const fetchAllVideos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${GLOBAL_SERVER_URL}/videos`);
            const data = await response.json();
            setVideos(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAllVideos();
    }, [])

    return (
        <div className="container space-y-8 pb-8">
            <div className="header">
                <h1 className="h2">Barcha videolar</h1>
                <VideosForm
                    isEdit={false}
                    buttonVariant="default-btn"
                    icon="plus"
                    open={open}
                    setOpen={setOpen}
                    fetchAllVideos={fetchAllVideos}
                />
            </div>

            <div className="flex flex-wrap gap-20 justify-start">
                {isLoading ? "Yuklanmoqda..." : (
                    videos.length > 0 ?
                        videos.map(video => <VideoCard video={video} key={video._id} fetchAllVideos={fetchAllVideos} />)
                        : <h1>Ma'lumot topilmadi</h1>
                )}
            </div>
        </div>
    )
}