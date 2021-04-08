import React, { useCallback, useState, useContext } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useMutation, gql } from "@apollo/client";
import Context from "../../context/Dashboard";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

const SETACCESS_MUTATION = gql`
  mutation SetAccessMutation($publictoken: String!) {
    setAccessToken(token: $publictoken)
  }
`;

const Link = () => {
  const { linkToken, refetch } = useContext(Context);
  const [publictoken, setPublicToken] = useState("");
  const [setAccess] = useMutation(SETACCESS_MUTATION, {
    variables: {
      publictoken: publictoken,
    },
    onCompleted: () => {
      refetch();
    },
  });

  const onSuccess = useCallback(
    (token) => {
      setPublicToken(token);
      setAccess();
      // send token to server
    },
    [setAccess]
  );
  const config = {
    token: linkToken,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <Button
      variant="contained"
      color="secondary"
      endIcon={<AddIcon />}
      onClick={() => open()}
      disabled={!ready}
    >
      add a bank
    </Button>
  );
};

export default Link;
