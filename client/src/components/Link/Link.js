import React, { useCallback, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useMutation, gql } from '@apollo/client';


const SETACCESS_MUTATION = gql`
  mutation SetAccessMutation( 
    $publictoken: String!
  ) {
    setAccessToken (
      token: $publictoken
    )
  }
`;

const Link = (props) => {

    const [publictoken, setPublicToken] = useState('');
    const [setAccess] = useMutation(SETACCESS_MUTATION, {
        variables: {
            publictoken: publictoken
        },
        onCompleted: () => {
          // refetch item id and update
          console.log('refetch');
          props.refetch();
        }
    });
    const onSuccess = useCallback((token, metadata) => {
        setPublicToken(token);
        console.log(token);
        console.log(metadata);
        console.log(publictoken);
        setAccess();
        // send token to server
    }, []);
    const config = {
        token: props.token,
        onSuccess,
    };
    const { open, ready } = usePlaidLink(config);
    return (
        <button onClick={() => open()} disabled={!ready}>
            Connect to Bank
        </button>
    );
}

export default Link;

