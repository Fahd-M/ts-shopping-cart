import Header from "./components/Header"
import Footer from "./components/Footer"
import Cart from "./components/Cart"
import ProductList from "./components/ProductList"

import { useState } from 'react'


function App() {
  const [viewCart, setViewCart] = useState<boolean>(false)

  // What is rendered is based on what viewcart is. if true render cart, if false render product list
  const pageContent = viewCart ? <Cart /> : <ProductList />

  const content = (
    <>
      <Header viewCart={viewCart} setViewCart={setViewCart} />
      {pageContent}
      <Footer viewCart={viewCart} />
    </>
  )

  return content
    
}
export default App


//NOTE: PRODUCTS ARRAY IN DATA FOLDER TO USE
//TODO: create context for each view:(1) product display view (2) cart view
// Cart context and products context

//  TODO: HEADER AND FOOTER, AREA FOR PRODUCTS DISPLAY AND CART DISPLAY 

// IMAGES FOLDER: for large projects where you pull from aws bucket 
// TODO: dynamically pull images into project





