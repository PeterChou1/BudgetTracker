import React, { useEffect, useContext } from "react";
import Context from "../../context/Dashboard";
import { useMutation, useSubscription, gql } from "@apollo/client";
import ItemList from "../ItemList/ItemList";
import Link from "../Link/Link";
import Grid from "@material-ui/core/Grid";
import BarChart from "../BarChart/BarChart";
import LnChart from "../LineChart/LineChart";
import AutoCompleteSearch from "./Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import { DateRangePicker } from "react-date-range";
import { format, parse } from "date-fns";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router";
import BudgetTable from "./BudgetTable";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const LINK_MUTATION = gql`
  mutation linkTokenMutation {
    createLinkToken {
      link_token
    }
  }
`;

const TRANSACTION_SUBSCRIPTION = gql`
  subscription getTransactionUpdate($items: [Items]) {
    transactionUpdate(items: $items) {
      webhook_code
      item_id
      new_transactions
    }
  }
`;

const SIGNOUT_MUTATION = gql`
  mutation signOutMutation {
    signout
  }
`;

const useStyles = makeStyles(() => ({
  container: {
    margin: "70px",
  },
}));
const getClass = (chart) => {
  switch (chart) {
    case "BarChart":
      return BarChart;
    case "LnChart":
      return LnChart;
    default:
      return BarChart;
  }
};
const Dashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  const [snackBarOpen, setSnackBar] = React.useState(false);
  const {
    checked,
    linkToken,
    startDate,
    endDate,
    dispatch,
    groupBy,
    refetch,
    ChartTag,
    ChartClass,
  } = useContext(Context);
  const [getlink] = useMutation(LINK_MUTATION, {
    onCompleted: (res) => {
      dispatch({
        type: "SET_STATE",
        state: {
          linkToken: res.createLinkToken.link_token,
        },
      });
    },
  });

  const [signout] = useMutation(SIGNOUT_MUTATION);
  useSubscription(TRANSACTION_SUBSCRIPTION, {
    variables: {
      items: checked,
    },
    onSubscriptionData: (data) => {
      // if end date is today fetch newly acquired data
      if (endDate === format(new Date(), "yyyy-MM-dd")) {
        // && update.new_transactions > 0) {
        refetch();
        setSnackBar(true);
      }
    },
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
        endDate,
      },
    });
  };
  const handleChangeGroup = (e) => {
    dispatch({
      type: "SET_STATE",
      state: {
        groupBy: e.target.value,
      },
    });
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBar(false);
  };
  const handleChangeChart = (e) => {
    dispatch({
      type: "SET_STATE",
      state: {
        ChartTag: e.target.value,
        ChartClass: getClass(e.target.value),
      },
    });
  };
  const selectionRange = {
    startDate: parse(startDate, "yyyy-MM-dd", new Date()),
    endDate: parse(endDate, "yyyy-MM-dd", new Date()),
    key: "selection",
  };
  // on mount fetch link
  useEffect(() => getlink(), [getlink]);
  return (
    <div className={classes.container}>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Recieve New Transactions Updates
        </Alert>
      </Snackbar>
      <Grid container spacing={3}>
        {/* buttons row segment */}
        <Grid container item xs={12}>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                history.push("/");
                signout();
              }}
            >
              Sign Out
            </Button>
          </Grid>
          <Grid item xs={2}>
            {linkToken === null ? "loading" : <Link></Link>}
          </Grid>
          <Grid item xs={4}>
            <FormControl style={{ minWidth: 200 }}>
              <InputLabel>Select Chart</InputLabel>
              <Select value={ChartTag} onChange={handleChangeChart}>
                <MenuItem value={"BarChart"}>Bar Chart</MenuItem>
                <MenuItem value={"LnChart"}>Line Chart</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {/* data row */}
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={3}>
            <ItemList></ItemList>
          </Grid>
          <Grid item xs={9}>
            <ChartClass></ChartClass>
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickDate}
            >
              {startDate} to {endDate}
            </Button>
            <Popover
              open={Boolean(anchorElDate)}
              anchorEl={anchorElDate}
              onClose={handleCloseDate}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <DateRangePicker
                ranges={[selectionRange]}
                onChange={handleSelectDate}
              />
            </Popover>
          </Grid>
          <Grid item xs={2}>
            <FormControl style={{ minWidth: 200 }}>
              <InputLabel>Group-By</InputLabel>
              <Select value={groupBy} onChange={handleChangeGroup}>
                <MenuItem value={"TRANSACTION"}>Transaction</MenuItem>
                <MenuItem value={"DAY"}>Day</MenuItem>
                <MenuItem value={"WEEK"}>Week</MenuItem>
                <MenuItem value={"MONTH"}>Month</MenuItem>
                <MenuItem value={"CATEGORY_1"}>Category</MenuItem>
                <MenuItem value={"CATEGORY_2"}>Category Detailed</MenuItem>
                <MenuItem value={"NAME"}>Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <AutoCompleteSearch />
          </Grid>
        </Grid>
        {/* table */}
        <Grid container item xs={12}>
          <BudgetTable></BudgetTable>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
