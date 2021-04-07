import React, { useEffect, useContext, useState } from "react";
import { Line } from "react-chartjs-2";
import { useQuery, gql, NetworkStatus } from "@apollo/client";
import Context from "../../context/Dashboard";
import lunr from "lunr";
const templatedata = {
  labels: [],
  datasets: [
    {
      label: "Spending",
      fill: false,
      lineTension: 0.5,
      backgroundColor: "rgba(75,192,192,1)",
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 2,
      data: [],
    },
  ],
};

const GET_TRANSACTION = gql`
  query getTransactionQuery(
    $items: [Items!]!
    $startDate: String!
    $endDate: String!
    $filter: [FilterToken]
    $sortBy: SortBy
    $sort: Sort
    $group: GroupBy
    $skip: Int
    $take: Int
  ) {
    getuser {
      getTransaction(
        items: $items
        startDate: $startDate
        endDate: $endDate
        filter: $filter
        sortBy: $sortBy
        sort: $sort
        group: $group
        skip: $skip
        take: $take
      ) {
        ... on Transaction {
          transaction_id
          amount
          merchant_name
          date
          category
        }
        ... on Group {
          groupid
          amount
          transactions {
            transaction_id
            amount
            merchant_name
            date
            category
          }
        }
      }
    }
  }
`;
const options = {
  title: {
    display: true,
    text: "Spending Chart",
    fontSize: 20,
  },
  legend: {
    display: true,
    position: "right",
  },
};
const transformCheck = (checked) => {
  const transform = [];
  for (var prop in checked) {
    if (Object.prototype.hasOwnProperty.call(checked, prop)) {
      transform.push({
        itemId: prop,
        accounts: checked[prop],
      });
    }
  }
  return transform;
};

const transformData = (data) => {
  let transformedData = JSON.parse(JSON.stringify(templatedata));
  const transactions = data.getuser.getTransaction;
  for (var transaction of transactions) {
    if (transaction.__typename === "Transaction") {
      transformedData.labels.push(
        transaction.merchant_name === null
          ? `transaction on ${transaction.date}`
          : `${transaction.merchant_name} ${transaction.date}`
      );
    } else if (transaction.__typename === "Group") {
      transformedData.labels.push(transaction.groupid);
    }
    transformedData.datasets[0].data.push(transaction.amount);
  }
  return transformedData;
};

const LnChart = () => {
  const {
    checked,
    checkCount,
    startDate,
    endDate,
    groupBy,
    filtertoken,
    dispatch,
  } = useContext(Context);
  const [lineData, setLineData] = useState();
  const { loading, error, refetch, networkStatus } = useQuery(GET_TRANSACTION, {
    notifyOnNetworkStatusChange: true,
    variables: {
      items: transformCheck(checked),
      startDate,
      endDate,
      filter: JSON.parse(JSON.stringify(filtertoken)).map((tok) => {
        delete tok.matchAmount;
        delete tok.display;
        return tok;
      }),
      sort: "ASC",
      sortBy: "DATE",
      group: groupBy,
    },
    onCompleted: (data) => {
      if (data !== undefined) {
        var idx = lunr(function () {
          const transactions = data.getuser.getTransaction;
          if (transactions.length > 0) {
            const isTrans = transactions[0].__typename == "Transaction";
            this.ref("transaction_id");
            this.field("date");
            this.field("merchant_name");
            this.field("amount");
            this.field("category");
            //this.use(tokenStrMetadata);
            for (var transaction of transactions) {
              if (isTrans) {
                this.add(transaction);
              } else {
                transaction.transactions.map((t) => this.add(t));
              }
            }
          }
        });
        setLineData(transformData(data));
        dispatch({
          type: "SET_STATE",
          state: {
            ...(filtertoken.length == 0 && {
              transactionsNonFilter: data.getuser.getTransaction,
              index: idx,
            }),
            transactions: data.getuser.getTransaction,
          },
        });
      }
    },
  });
  useEffect(() => {
    refetch({
      items: transformCheck(checked),
      startDate,
      endDate,
    });
  }, [checked, checkCount, startDate, endDate]);
  var state;
  if (networkStatus === NetworkStatus.refetch) {
    state = "Refetching!";
  } else if (loading) {
    state = "Loading ...";
  } else if (error) {
    state = `error ${error.message}`;
  }
  return lineData !== undefined ? (
    <Line data={lineData} options={options}></Line>
  ) : (
    "Loading..."
  );
};
export default LnChart;
