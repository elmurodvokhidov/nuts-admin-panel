import {
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { decryptKey } from "@/lib/utils";
import { PASSCODE } from "@/constants";

export default function RootLayout() {
    const navigate = useNavigate();
    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('accessKey') : null;

    useEffect(() => {
        const accessKey = encryptedKey && decryptKey(encryptedKey);
        if (accessKey !== PASSCODE) {
            navigate("/locked");
        }
    }, [encryptedKey])

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <SidebarTrigger />
                <Outlet />
            </main>
        </SidebarProvider>
    )
}