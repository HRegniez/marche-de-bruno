import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface Product {
  id: string
  name: string
  price: string
  origin: string
  type: string
  in_stock: boolean
}

export interface ProductType {
  id: string
  name: string
}

export interface ProductCategory {
  id: string
  name: string
  image: string 
  products: Product[]
}

export async function getProducts(): Promise<ProductCategory[]> {

  const { data: types, error: typesError } = await supabase
    .from('bruno_produit_types')
    .select('*')

  if (typesError) {
    throw typesError
  }
 
  const { data: products, error: productsError } = await supabase
    .from('bruno_produits')
    .select('*')

  if (productsError) {
    throw productsError
  }

  const result = types.map(type => ({
    id: type.id,
    name: type.name,
    image: `/images/categories/${type.name.toLowerCase()}.jpg`,
    products: products
      .filter(product => product.type === type.id)
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        origin: product.origin,
        type: product.type,
        in_stock: product.in_stock
      }))
  }))

  return result
} 