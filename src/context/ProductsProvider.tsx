import { createContext, ReactElement, useState, useEffect } from "react"

//create product type based on products.json
export type ProductType = {
    sku: string,
    name: string,
    price: number,
}
// use type when defining initial state.
//METHOD 1: More simple for deployment
const initState: ProductType[] = [
    {
        "sku":"item0001",
        "name":"Widget",
        "price": 9.99
    },
    {
        "sku":"item0002",
        "name":"Premium Widget",
        "price": 19.99
    },
    {
        "sku":"item0003",
        "name":"Deluxe Widget",
        "price": 29.99
    }
]

//METHOD 2: IF USING DATA JSON: import useEffect and add it to the ProductsProvider below
// const initState: ProductType[] = []



//create type for products (key) as well (above is the value of products)
export type UseProductsContextType = { 
    // an object that contains products of type product type
    products: ProductType[] 
}

// Defining initial context state
const initContextState: UseProductsContextType = {
    products:[] 
}

//Create context
const ProductsContext = createContext<UseProductsContextType>(initContextState)

// create a children type
type ChildrenType = {
    children?: ReactElement | ReactElement[] | undefined
}

// create provider
// RECALL: children are in-between opening/closing jsx tags, it is NOT prop thats passed down and used.
// Note: ReactElement is returned below
export const ProductsProvider = ({ children }: ChildrenType): ReactElement => {
    const [products, setProducts] = useState<ProductType[]>(initState)

    //FOR METHOD 2: will use setProducts
    //only load products once when provider loads
    // useEffect(() => {
    //     const fetchProducts = async (): Promise<ProductType[]> => {
    //         const data = await fetch('http://localhost:3500/products')
    //             .then(res => {
    //             //receive data, then return this data as json
    //                 return res.json()
    //             }).catch(err => {
    //                 if (err instanceof Error) console.log(err.message)
    //             })
    //             return data
    //         }
    //         //call fx, get products, set products 
    //         fetchProducts().then(products => setProducts(products))
    // },[])

// TODO: Launch products.json server as dev environment so that useEffect works
// --> In terminal: npx json-server -w data/products.json -p 3500

    return (
        <ProductsContext.Provider value={{ products }}>
            {children}
        </ProductsContext.Provider>

    )
}

export default ProductsContext
