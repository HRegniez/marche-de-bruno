"use client"

import { useState, useEffect } from 'react'
import { getProducts } from "@/lib/supabase/products"
import NouveauProduit from "./NouveauProduit"
import EditerProduit from './EditerProduit'
import EditerCategory from './EditerCategory'
import NouvelleCategorie from './NouvelleCategorie'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

type Product = {
    id: string;
    name: string;
    price: string;
    origin: string;
    type: string;
    in_stock: boolean;
}

type Category = {
    id: string;
    name: string;
    image: string;
    products: Product[];
}

export default function Produits() {
    const [products, setProducts] = useState<Category[]>([])
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const refreshData = () => {
        setRefreshTrigger(prev => prev + 1)
    }

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const productsData = await getProducts();
            // Sort categories alphabetically by name
            const sortedProductsData = [...productsData].sort((a, b) => 
                a.name.localeCompare(b.name)
            );
            setProducts(sortedProductsData);
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
        fetchProducts()
    }, [refreshTrigger])

    return (
        <div className="w-full mt-10">
                <h1 className="text-xl font-bold mb-4">Produits</h1>
                {products.map((category: Category) => (
                    <div key={category.id} className="mb-8 border rounded-lg shadow-sm">
                        <div 
                            className="p-2 flex items-center justify-between cursor-pointer"
                            onClick={(e) => {
                                // Don't collapse if clicking on input or buttons
                                if (e.target instanceof HTMLInputElement || 
                                    e.target instanceof HTMLButtonElement ||
                                    (e.target instanceof SVGElement && e.target.closest('button'))) {
                                    return;
                                }
                                toggleExpand(category.id);
                            }}
                        >
                            <EditerCategory 
                                category={category} 
                                onUpdate={refreshData} 
                                isExpanded={expandedId === category.id}
                            />
                            <ChevronDownIcon 
                                className={`w-5 h-5 transition-transform duration-200 ${
                                    expandedId === category.id ? 'transform rotate-180' : ''
                                }`}
                            />
                        </div>
                        <div className={`
                            overflow-hidden transition-all duration-200 ease-in-out
                            ${expandedId === category.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                        `}>
                            <div className="p-2 pt-2 border-t">
                                <div className="grid gap-2">
                                    <EditerProduit category={category} allCategories={products} onUpdate={refreshData} />
                                    <NouveauProduit category={category} allCategories={products} onUpdate={refreshData} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <NouvelleCategorie onUpdate={refreshData} />
            </div>
    )}
