import { ProductType } from "../context/ProductsProvider";
import { ReducerActionType, ReducerAction } from "../context/CartProvider"
import { ReactElement, memo } from "react";


type PropsType = {
    product:ProductType,
    dispatch:React.Dispatch<ReducerAction>,
    REDUCER_ACTIONS:ReducerActionType,
    inCart:boolean,
}

const Product = ({ product, dispatch, REDUCER_ACTIONS, inCart}:PropsType): ReactElement => {
  
   //FYI Old method - WILL NOT WORK WITH VITE
   //const img: string = require(`../images/${product.sku}.jpg`)
  
    // METHOD2: will work with react or vite -> creating a new url  
    const img: string = new URL(`../images/${product.sku}.jpg`, import.meta.url).href

    const onAddToCart = () => dispatch({ type: REDUCER_ACTIONS.ADD, payload: { ...product, qty: 1}})

    const itemInCart = inCart ? ' -> Item in Cart: ✔️ ' : null

    const content = 
        <article className="product">
            <h3>{product.name}</h3>
            <img src={img} alt={product.name} className="product__img" />
            <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD'}).format(product.price)}{itemInCart} </p>
            <button onClick={onAddToCart}>Add to Cart </button>
        </article>

    return content
}

//OPTIMIZING PRODUCTS WITH MEMO 

//create comparison fx 
function areProductsEqual({ product: prevProduct, inCart: prevInCart }: PropsType, { product: nextProduct, inCart: nextInCart }:PropsType) {
    return (
        Object.keys(prevProduct).every(key => {
            return prevProduct[key as keyof ProductType] === nextProduct[key as keyof ProductType]
        }) && prevInCart === nextInCart
    )
} 
// Note: See assertions notes and index signatures notes from TS documentation

const MemoizedProduct = memo<typeof Product>(Product,  areProductsEqual)
// Above will ensure that a re-render will only take place for a single product that is being affected, not all products



export default MemoizedProduct