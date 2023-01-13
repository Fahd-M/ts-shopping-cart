import { ChangeEvent, ReactElement, memo } from "react"
import { CartItemType } from "../context/CartProvider"
import { ReducerAction } from "../context/CartProvider"
import { ReducerActionType } from "../context/CartProvider"

type PropsType = {
    item: CartItemType,
    dispatch:React.Dispatch<ReducerAction>,
    REDUCER_ACTIONS: ReducerActionType
}
const CartLineItem = ({ item, dispatch, REDUCER_ACTIONS}:PropsType) => {

    const img: string = new URL(`../images/${item.sku}.jpg`, import.meta.url).href

    const lineTotal: number = (item.qty * item.price)

    const highestQty: number = 20 > item.qty ? 20 : item.qty

    const optionValues: number[] = [ ...Array(highestQty).keys()].map(int => int + 1)
    // no 0 value used because it is int + 1

    const options: ReactElement[] = optionValues.map(val => {
        return <option key={`opt${val}`} value={val}>{val}</option>
    })

    const onChangeQty = (e: ChangeEvent<HTMLSelectElement>) => {
        dispatch({
            type:REDUCER_ACTIONS.QUANTITY,
            payload: {...item, qty: Number(e.target.value)}
        })
    }

    const onRemoveFromCart = () => dispatch({
        type: REDUCER_ACTIONS.REMOVE,
        payload: item,
    })
    
    const content = (
        <li className="cart__item">
            <img src={img} alt={item.name} className="cart__img" />
            <div aria-label="Item Name">{item.name}</div>
            <div aria-label="Price Per Item">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency:'USD'}).format(item.price)}
            </div>

            <label htmlFor="itemQty" className="offscreen">
                Item Quantity
            </label>
            <select
                name="itemQty"
                id="itemQty" 
                className="cart__select"
                value={item.qty}
                aria-label="Item Quantity"
                onChange={onChangeQty}
            >{options}</select>

            <div className="cart__item-subtotal" aria-label="Line Item Subtotal">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency:'USD'}).format(lineTotal)}
            </div>

            <button 
                className="cart__button"
                aria-label="Remove Item From Cart"
                title="Remove Item From Cart"
                onClick={onRemoveFromCart}
            >
                ❌
            </button>

        </li>
    )

    return content
}

//OPTIMIZING CART LINE ITEMS WITH MEMO 

//need fx to see if values are equal in both objects
// MemoizedCartLineItem is equal to CartLineItem because we pass in an object
function areItemsEqual({ item: prevItem}: PropsType, {item: nextItem }:PropsType) {
    return Object.keys(prevItem).every(key => {
        //using an assertion here
        return prevItem[key as keyof CartItemType] === nextItem[key as keyof CartItemType]
    })
}
const MemoizedCartLineItem = memo<typeof CartLineItem>(CartLineItem, areItemsEqual)
//Above ensures that there is no re-render unless the cart line items changes. if qty of 1 lineitem changes the others should not change.

// NTS: can be more explicit with the key type and return type.
// const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>
// function areItemsEqual({ item: prevItem }: PropsType, { item: nextItem }: PropsType) {
//     return getKeys<CartItemType>(prevItem).every(key => prevItem[key] === nextItem[key]);
// }

export default MemoizedCartLineItem