import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { Product } from "@/routes/Products";
import { GLOBAL_SERVER_URL } from "@/constants";
import ProductsForm from "./ProductsForm";

export default function ProductCard({ product, fetchAllProducts }: { product: Product; fetchAllProducts: () => void; }) {
    const [open, setOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await fetch(`${GLOBAL_SERVER_URL}/products/${product._id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) return fetchAllProducts();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Card className="w-[300px] group relative space-y-4 overflow-hidden">
                <figure className="group-hover:opacity-90">
                    <img
                        className="aspect-square w-full object-cover"
                        src={product.imgUrl}
                        width={300}
                        height={500}
                        alt={product.title}
                    />
                </figure>
                <CardContent className="px-4 py-0">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-lg">{product.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {product.description.length > 80 ? product.description.slice(0, 80) + "..." : product.description}
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-0 border-t">
                    <ProductsForm
                        product={product}
                        isEdit={true}
                        buttonVariant="ghost-btn"
                        icon="edit"
                        open={open}
                        setOpen={setOpen}
                        fetchAllProducts={fetchAllProducts}
                    />
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
                title="Mahsulotni o'chirish"
                description="Ushbu mahsulotni o'chirishni xohlaysizmi? Bu amalni keyin qaytarib bo'lmaydi."
                onConfirm={handleDelete}
            />
        </>
    );
}