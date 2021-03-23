import React, { useEffect, useContext } from 'react';
import Context from "../../context/Dashboard";
import { useMutation, gql } from '@apollo/client';
import ItemList from '../ItemList/ItemList';
import Link from '../Link/Link';
import Grid from '@material-ui/core/Grid';
import BarChart from '../BarChart/BarChart';
import { makeStyles } from '@material-ui/core/styles';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import { DateRangePicker } from 'react-date-range';
import { format, parse } from 'date-fns';

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
    const { linkToken, startDate, endDate, dispatch } = useContext(Context);
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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSelect = (ranges) => {
        var startDate = format(ranges.selection.startDate, "yyyy-MM-dd");
        var endDate = format(ranges.selection.endDate, "yyyy-MM-dd");
        dispatch({
            type: "SET_STATE",
            state: {
                startDate,
                endDate
            }
        });
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const selectionRange = {
        startDate: parse(startDate, "yyyy-MM-dd", new Date()),
        endDate: parse(endDate, "yyyy-MM-dd", new Date()),
        key: 'selection',
    };
    // on mount fetch link
    useEffect(() => getlink(), []);
    return (
        <div className={classes.container}>
            <Grid container spacing={3}>
                {/* buttons row segment */}
                <Grid container item xs={12}>
                    <Grid item xs={2}>
                        {linkToken  === null ? 'loading' : <Link></Link>}
                    </Grid>
                    <Grid item xs={3}>
                        <Button aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
                            {startDate} to {endDate} 
                        </Button>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <DateRangePicker ranges={[selectionRange]} onChange={handleSelect}/>
                        </Popover>
                    </Grid>
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