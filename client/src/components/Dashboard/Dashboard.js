import React, { useEffect, useContext } from 'react';
import Context from "../../context/Dashboard";
import { useMutation, gql } from '@apollo/client';
import ItemList from '../ItemList/ItemList';
import Link from '../Link/Link';
import Grid from '@material-ui/core/Grid';
import BarChart from '../BarChart/BarChart';
import AutoCompleteSearch from './Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
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
    const { linkToken, startDate, endDate, dispatch, groupBy } = useContext(Context);
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
    const [anchorElDate, setAnchorElDate] = React.useState(null);
    const handleClickDate = (event) => {
        setAnchorElDate(event.currentTarget);
    };
    const handleCloseDate = () => {
        setAnchorElDate(null);
    };
    const handleSelectDate = (ranges) => {
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
    const handleChangeGroup = (e) => {
        dispatch({
            type: "SET_STATE",
            state: {
                groupBy: e.target.value
            }
        });
    };

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
                <Grid container item xs={12} spacing={3}>
                     <Grid item xs={2}>
                        <Button variant="contained" color="primary" onClick={handleClickDate}>
                            {startDate} to {endDate} 
                        </Button>
                        <Popover
                            open={Boolean(anchorElDate)}
                            anchorEl={anchorElDate}
                            onClose={handleCloseDate}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <DateRangePicker ranges={[selectionRange]} onChange={handleSelectDate}/>
                        </Popover>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl style={{minWidth: 200}}> 
                            <InputLabel >Group-By</InputLabel>
                            <Select
                                value={groupBy}
                                onChange={handleChangeGroup}
                            >
                                <MenuItem value={"TRANSACTION"}>Transaction</MenuItem>
                                <MenuItem value={"DAY"} >Day</MenuItem>
                                <MenuItem value={"WEEK"}>Week</MenuItem>
                                <MenuItem value={"MONTH"}>Month</MenuItem>
                                <MenuItem value={"CATEGORY_1"} >Category</MenuItem>
                                <MenuItem value={"CATEGORY_2"}>Category Detailed</MenuItem>
                                <MenuItem value={"NAME"}>Name</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <AutoCompleteSearch/>
                    </Grid>
                </Grid>
                {/* table */}
                <Grid container item xs={12}>

                </Grid>
            </Grid>
        </div>
    ); 

};

export default Dashboard;