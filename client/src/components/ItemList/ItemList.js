
import React, { useCallback, useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useMutation, gql } from '@apollo/client';
import Link from '../Link/Link';


const LINK_MUTATION = gql`
  mutation linkTokenMutation {
    createLinkToken {
        link_token
    }
  }
`;
const ItemList = () => {
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
    return (
        <div>
            <div>
            {linktoken === '' ? 'loading' : <Link token={linktoken}></Link>}
            </div>
        </div>
    )
}

export default ItemList;