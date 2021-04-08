
import React, {useState, useEffect, useContext } from 'react';
import {useMutation, useQuery, gql } from '@apollo/client';
import Context from "../../context/Dashboard";
import { NetworkStatus } from "@apollo/client";
import "./../../styles/ItemList.css";
import { makeStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: 500,
    maxWidth: 250,
    overflow: "auto",
  },
  list: {
    width: "100%",
    maxHeight: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  listTitle: {
    margin: "10px",
  },
}));
const getCheckmark = (checked, value, accountId) => {
    let plaidItem = checked.filter(function(item) {
        return item.itemId === value;
    });
    if (plaidItem.length == 0) {
        return false
    } else  {
        return plaidItem[0].accounts.indexOf(accountId) !== -1;
    }
}
// retrieve an item 
const GET_ITEM_QUERY = gql`
   query getItemQuery {
       getuser {
           username
           plaidAcc
           items {
               itemId
               name
               accounts {
                    account_id
                    name
                }
           }
       }
   }
`;

const UPDATE_ACCOUNT = gql`
mutation UpdatePreference($username: String!, $plaidAcc: String!) {
    updatePreference(username: $username, plaidAcc: $plaidAcc)
  }

`;
const ItemList = () => {
    const classes = useStyles();
    const [updateAccount] = useMutation(UPDATE_ACCOUNT);
    const [username, setUsername] = useState('');
    const { items, checked, checkCount, dispatch } = useContext(Context);
    //const [checked, setChecked] = React.useState([]);
    // set checked code https://material-ui.com/components/lists/#checkbox
    const handleToggle = (accId, itemId) => () => {
        const acc = checked.filter(function(item) {
            return item.itemId === itemId;
        })[0];
        if (acc) {
            const currentIndex = acc.accounts.indexOf(accId);
            if (currentIndex === -1) {
                acc.accounts.push(accId);
            } else {
                acc.accounts.splice(currentIndex, 1);
            }
        } else {
            checked.push({itemId:itemId, accounts: [accId]});
        }
        updateAccount({ variables: { username: username, plaidAcc: JSON.stringify(checked) } });
        dispatch({
            type: "SET_STATE",
            state: {
              items: data.getuser.items,
            },
        });
    };
    const { loading, error, data, refetch, networkStatus } = useQuery(GET_ITEM_QUERY, {
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {
            if (data !== undefined) {
                setUsername(data.getuser.username);
                dispatch({
                    type: "SET_STATE",
                    state: {
                        checked: (data.getuser.plaidAcc) ? JSON.parse(data.getuser.plaidAcc):[],
                        items: data.getuser.items
                    },
                });
            }
        }
    });
    console.log(checked);
    useEffect(() => {
        dispatch({
            type: "SET_STATE",
            state: {
                refetch: refetch
            }
        });
    }, []);
    var state;
    if (networkStatus === NetworkStatus.refetch) {
        state = 'Refetching!'; 
    } else if (loading) {
        state = 'Loading ...' ;
    } else if (error) {
        state = `error ${error.message}`;
    }
    return (
        <Paper elevation={3} className={classes.root}>
            <div className={classes.listTitle}>
                Linked Bank Accounts
            </div>
            {Array.isArray(items) ? 
                    <List className={classes.list}>
                    {items.length > 0 ? items.map((value) => {
                        return (
                            <ul key={value.itemId}>
                                    <ListSubheader>{value.name}</ListSubheader>
                                    {value.accounts.map( account => {
                                        return (
                                            <ListItem key={account.account_id} button>
                                                <ListItemText  primary={account.name} />
                                                <ListItemSecondaryAction>
                                                <Checkbox
                                                    edge="end"
                                                    onChange={handleToggle(account.account_id, value.itemId)}
                                                    checked={getCheckmark(checked, value.itemId, account.account_id)}
                                                />
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )
                                    })}
                            </ul>
                        )
                    }) : 'click on add a bank to get started'}
                </List>  : state}
        </Paper>
    )
}

export default ItemList;
