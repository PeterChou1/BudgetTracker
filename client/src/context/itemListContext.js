import { createContext, useReducer } from "react";

const initialState = {
    linkToken: "",
    itemIds: "default value"
};

const Context = createContext(initialState);

const { Provider } = Context;
export const ItemListProvider = (props) => {

    const reducer = (state, action) => {
        switch (action.type) {
            case "SET_STATE":
                return {...state, ...action.state };
            default:
                return { ...state };
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);
    return <Provider value={{ ...state, dispatch}}>{props.children}</Provider>
};
export default Context;