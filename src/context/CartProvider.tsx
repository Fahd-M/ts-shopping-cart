import { useReducer, useMemo, createContext, ReactElement} from "react"

export type CartItemType = {
    sku: string,
    name: string,
    price: number,
    qty: number
}

type CartStateType = {
    cart: CartItemType[]
}

const initCartState: CartStateType = {
    // initCartState will be a value
    cart: [] 
}

//create reducer action type because cart requires a reducer
// NOTE: can also use enum method (see github ts-context-reducer repo) or string method(below)

const REDUCER_ACTION_TYPE = {
    //properties match strings. these are the actions for the cart
    ADD:"ADD",
    REMOVE:"REMOVE",
    QUANTITY:"QUANTITY",
    SUBMIT:"SUBMIT"
}

export type ReducerActionType = typeof REDUCER_ACTION_TYPE

export type ReducerAction = {
    type: string,
    payload?: CartItemType,
}

//start reducer fx which returns CartStateType
const reducer = (state: CartStateType, action: ReducerAction): CartStateType => {
    switch (action.type) {
        case REDUCER_ACTION_TYPE.ADD: {
            if (!action.payload) {
                throw new Error('action.payload missing in ADD action')
            }
            //Add will need info from action payload
            const { sku, name, price } = action.payload  //destructured

            //Filter cart so we have all items we aren't updating
            const filteredCart: CartItemType[] = state.cart.filter(item => item.sku != sku)
            
            // Make sure item we are updating exists
            const itemExists: CartItemType | undefined = state.cart.find(item => item.sku === sku)
            
            const qty: number = itemExists ? itemExists.qty + 1 : 1
            
            return { ...state, cart: [...filteredCart, { sku, name, price, qty }]}
        
        }
        case REDUCER_ACTION_TYPE.REMOVE: {
            if (!action.payload) {
                throw new Error('action.payload missing in REMOVE action')
            }
            //REMOVE will need info from action payload
            const { sku } = action.payload  //destructured

            //Filter cart so we have all items we aren't updating
            const filteredCart: CartItemType[] = state.cart.filter(item => item.sku != sku)
            
            return { ...state, cart: [...filteredCart] }
        }
        case REDUCER_ACTION_TYPE.QUANTITY:{
            if (!action.payload) {
                throw new Error('action.payload missing in QUANTITY action')
            }

            const { sku, qty } = action.payload  //destructured

            // Make sure item we are updating exists
            const itemExists: CartItemType | undefined = state.cart.find(item => item.sku === sku)
            
            if(!itemExists) {
                throw new Error('Item must exist in order to update quantity')
            }

            //define updated item
            const updatedItem: CartItemType = { ...itemExists, qty }

            //Filter cart so we have all items we aren't updating
            const filteredCart: CartItemType[] = state.cart.filter(item => item.sku != sku)
                        
            return { ...state, cart: [...filteredCart, updatedItem]} 
        }
        case REDUCER_ACTION_TYPE.SUBMIT:{
            //empty out cart after order placed
            return { ...state, cart:[] }
        }
        default:
            throw new Error('Unidentified reducer action type')
    }
}

const useCartContext = (initCartState: CartStateType) => {
    const [state, dispatch] = useReducer(reducer, initCartState)

    // Memoize the value of the object

    const REDUCER_ACTIONS = useMemo(() => {
        return REDUCER_ACTION_TYPE
    }, [])
    // Memoize that reducer action type so it always has the same referential equality when we pass it into a component 
    //and that will help memoize the component in the future without worrying about reducer actions causing a re-render.

    const totalItems:number = state.cart.reduce((previousValue, cartItem) => {
        return previousValue + cartItem.qty
    }, 0)

    //format currency to display
    const totalPrice = new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD'}).format(
        state.cart.reduce((previousValue, cartItem) => {
            return previousValue + (cartItem.qty * cartItem.price)
        }, 0)
    )

    //put cart in order when looking at cart
    const cart = state.cart.sort((a,b) => {
        const itemA = Number(a.sku.slice(-4))
        const itemB = Number(b.sku.slice(-4))
        return itemA - itemB
    })

    //dispatch and REDUCER_ACTIONS are memoized so should not cause re-render
    return { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart }
}

export type UseCartContextType = ReturnType<typeof useCartContext>

const initCartContextState: UseCartContextType = {
    dispatch: () => {},
    REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
    totalItems:0,
    totalPrice: '',
    cart: [],
}

export const CartContext = createContext<UseCartContextType>(initCartContextState)

type ChildrenType = {
    children?: ReactElement | ReactElement[] 
}

export const CartProvider = ({ children }: ChildrenType ): ReactElement => {
    return (
        <CartContext.Provider value={useCartContext(initCartState)} >
            {children}
        </CartContext.Provider>
    )
}

export default CartContext