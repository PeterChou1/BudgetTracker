import { createContext, useReducer } from "react";
import { format, sub } from 'date-fns';

const initialState = {
    // link token for user
    linkToken: null,
    // item of user
    items: null,
    // refetch hook
    refetch: null,
    // what account is checked in UI
    checked: {},
    // hacky solution to detect state change might want to refactor
    checkCount : 0,
    groupBy : 'TRANSACTION',
    // start date end date 
    startDate:  format(sub(new Date(), {days: 7}), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
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