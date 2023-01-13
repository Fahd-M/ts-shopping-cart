import useCart from "../hooks/useCart"
import useProducts from "../hooks/useProducts"
import { UseProductsContextType } from "../context/ProductsProvider"
import { ReactElement } from "react"
import Product from "./Product"

const ProductList = () => {

  const { dispatch, REDUCER_ACTIONS, cart } = useCart()
  const { products } = useProducts()

  let pageContent: ReactElement | ReactElement[] = <p>Loading...</p>
  //only would see when fetching the info, not seen when hardcoded like it is for this example

  if (products?.length) {
    pageContent = products.map(product => {
      const inCart: boolean = cart.some(item => item.sku === product.sku) //some checks if any one of these is true
      
      return ( //return from map 
        <Product 
          key={product.sku}
          product={product}
          dispatch={dispatch} //does not need to be memoized.it doesnt need to worry about referential equality 
          REDUCER_ACTIONS={REDUCER_ACTIONS} //already memoized in CartContext so no new render 
          inCart={inCart}
        />
      )
    })
  }

  const content = (
    <main className="main main--products">
      {pageContent}
    </main>
  )

  return content
}

export default ProductList