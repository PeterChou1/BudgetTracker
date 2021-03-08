
import React, { useState, useEffect, useContext } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import Link from '../Link/Link';
import Context from "../../context/itemListContext";
import { NetworkStatus } from '@apollo/client';

const LINK_MUTATION = gql`
  mutation linkTokenMutation {
    createLinkToken {
        link_token
    }
  }
`;

const GET_ITEM_QUERY = gql`
   query getItemQuery {
       getuser {
           items {
               itemId
               name
           }
       }
   }
`;
const ItemList = () => {
    const { itemIds, dispatch } = useContext(Context);
    const [linktoken, setLinkToken] = useState('');
    const [getlink] = useMutation(LINK_MUTATION, {
        onCompleted: (res) => {
            console.log(res);
            setLinkToken(res.createLinkToken.link_token);
            console.log(linktoken);
        }
    });
    useEffect(() => {
        console.log('use effect on mount');
        getlink();
    }, []);
    const { loading, error, data, refetch, networkStatus } = useQuery(GET_ITEM_QUERY, {
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {
            console.log('--on complete data--');
            console.log(data);
            dispatch({
                type: "SET_STATE",
                state: {
                    itemIds: data.getuser.items
                },
            });
        }
    });

    var state;
    if (networkStatus === NetworkStatus.refetch) {
        state = 'Refetching!'; 
        console.log(data);
    } else if (loading) {
        state = 'Loading ...' ;
    } else if (error) {
        state = `error ${error.message}`;
    } else {
        state = data.getuser.items;
    }
    console.log(state);
    return (
        <div>
            <div>
                {linktoken === '' ? 'loading' : <Link token={linktoken} refetch={refetch}></Link>}
            </div>
            <div>
                <ul>
                    {Array.isArray(state) ? state.map(val => <li>{val.name}</li> ) : state}
                </ul>
            </div>
        </div>
    )
}

export default ItemList;