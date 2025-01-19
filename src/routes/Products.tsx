import ProductCard from "@/components/ProductCard";
import ProductsForm from "@/components/ProductsForm";
import { GLOBAL_SERVER_URL } from "@/constants";
import { useEffect, useState } from "react";

export interface Product {
    _id: string;
    title: string;
    description: string;
    imgUrl: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export default function Products() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    const fetchAllProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${GLOBAL_SERVER_URL}/products`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchAllProducts();
    }, [])

    return (
        <div className="container space-y-8 pb-8">
            <div className="header">
                <h1 className="h2">Barcha mahsulotlar</h1>
                <ProductsForm
                    isEdit={false}
                    buttonVariant="default-btn"
                    icon="plus"
                    open={open}
                    setOpen={setOpen}
                    fetchAllProducts={fetchAllProducts}
                />
            </div>

            <div className="flex flex-wrap gap-20 justify-start">
                {isLoading ? "Yuklanmoqda..." : (
                    products.length > 0 ?
                        products.map(product => <ProductCard product={product} key={product._id} fetchAllProducts={fetchAllProducts} />)
                        : <h1>Ma'lumot topilmadi</h1>
                )}
            </div>
        </div>
    )
}