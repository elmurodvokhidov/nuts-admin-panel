import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("accessKey");
        navigate("/locked");
    }

    return (
        <button className="flex items-center justify-start gap-2" onClick={handleLogout}>
            <LogOut className="size-5" />
            Chiqish
        </button>
    )
}