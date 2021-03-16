import React, { useEffect, useContext } from 'react';
import Context from "../../context/Dashboard";
import { useMutation, gql } from '@apollo/client';
import ItemList from '../ItemList/ItemList';
import Link from '../Link/Link';
import Grid from '@material-ui/core/Grid';
import BarChart from '../BarChart/BarChart';
import { makeStyles } from '@material-ui/core/styles';

const LINK_MUTATION = gql`
  mutation linkTokenMutation {
    createLinkToken {
        link_token
    }
  }
`;

const useStyles = makeStyles(() => ({
    container: {
        margin: '70px'
    }
}));

const Dashboard = () => {
    const classes = useStyles();
    const { linkToken, dispatch } = useContext(Context);
    const [getlink] = useMutation(LINK_MUTATION, {
        onCompleted: (res) => {
            dispatch({
                type: "SET_STATE",
                state: {
                    linkToken: res.createLinkToken.link_token
                },
            });
        }
    });
    useEffect(() => getlink(), []);
    return (
        <div className={classes.container}>
            <Grid container spacing={3}>
                {/* buttons row segment */}
                <Grid container item xs={12} spacing={4}>
                    {linkToken  === null ? 'loading' : <Link></Link>}
                </Grid>
                {/* data row */}
                <Grid container item xs={12} spacing={3}>
                    <Grid item xs={3}>
                        <ItemList></ItemList>
                    </Grid>
                    <Grid item xs={9}>
                        <BarChart></BarChart>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    ); 

};

export default Dashboard;