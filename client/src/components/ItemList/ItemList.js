
import React, { useEffect, useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import Context from "../../context/Dashboard";
import { NetworkStatus } from '@apollo/client';
import './../../styles/ItemList.css';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';


const useStyles = makeStyles((theme) => ({
    root: {
        maxHeight: 500,
        maxWidth: 250,
        overflow: 'auto'
    },
    list: {
      width: '100%',
      maxHeight: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    listTitle: {
        margin: '10px'
    },
}));
// retrieve an item 
const GET_ITEM_QUERY = gql`
   query getItemQuery {
       getuser {
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
const ItemList = () => {
    const classes = useStyles();
    const { items, checked, checkCount, dispatch } = useContext(Context);
    //const [checked, setChecked] = React.useState([]);
    // set checked code https://material-ui.com/components/lists/#checkbox
    const handleToggle = (accId, itemId) => () => {
        console.log('checked');
        console.log(items);
        const acc = checked[itemId];
        if (acc) {
            console.log(acc);
            const currentIndex = acc.indexOf(accId);
            if (currentIndex === -1) {
                acc.push(accId);
            } else {
                acc.splice(currentIndex, 1);
            }
        } else {
            checked[itemId] = [accId];
        }

        dispatch({
            type: "SET_STATE",
            state: {
                checkCount : checkCount + 1,
                checked: checked
            },
        });
    };
    const { loading, error, data, refetch, networkStatus } = useQuery(GET_ITEM_QUERY, {
        notifyOnNetworkStatusChange: true,
        onCompleted: (data) => {
            if (data !== undefined) {
                dispatch({
                    type: "SET_STATE",
                    state: {
                        items: data.getuser.items
                    },
                });
            }
        }
    });
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
                Linked Bank
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
                                                    checked={checked[value.itemId] ? checked[value.itemId].indexOf(account.account_id) !== -1 : false}
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