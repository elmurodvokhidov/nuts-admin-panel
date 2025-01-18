import { Route, Routes, useNavigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import LockScreen from "./routes/LockScreen";
import Dashboard from "./routes/Dashboard";
import { useEffect } from "react";
import Products from "./routes/Products";
import Videos from "./routes/Videos";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!true) {
      navigate("/locked");
    }
  }, [])

  return (
    <Routes>
      <Route path="/locked" element={<LockScreen />} />
      <Route element={<RootLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="videos" element={<Videos />} />
      </Route>
    </Routes>
  )
}