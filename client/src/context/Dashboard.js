import { createContext, useReducer } from "react";

const initialState = {
    // link token for user
    linkToken: null,
    // items that user wants to query
    activeitems: null,
    // item of user
    items: null,
    // refetch hook
    refetch: null,
    // checked
    checked: {},
    // hacky solution to detect state change might want to refactor
    checkCount : 0
};

const Context = createContext(initialState);

const { Provider } = Context;
export const DashboardProvider = (props) => {
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