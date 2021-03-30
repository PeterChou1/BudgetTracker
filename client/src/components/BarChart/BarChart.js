import React, { useEffect, useContext, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useQuery, gql, NetworkStatus } from '@apollo/client';
import Context from "../../context/Dashboard";
var templatedata = {
  labels: [],
  datasets: [
    {
      label: 'Spending Chart',
      data: [],
      borderWidth: 1,
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};


const GET_TRANSACTION = gql`
  query getTransactionQuery(
                     $items: [Items!]!,
                     $startDate: String!,
                     $endDate: String!,
                     $sortBy: SortBy,
                     $sort: Sort,
                     $group: GroupBy,
                     $skip: Int,
                     $take: Int)  {
    getuser {
      getTransaction(items: $items,
                     startDate: $startDate,
                     endDate: $endDate,
                     sortBy: $sortBy,
                     sort: $sort,
                     group: $group,
                     skip: $skip,
                     take: $take) {
                        ... on Transaction {
                          amount
                          merchant_name
                          date
                        }
                        ... on Group {
                          groupid
                          amount
                        }
                   }
    }
  }
`;

const transformCheck = (checked) => {
  const transform = [];
  for (var prop in checked) {
    if (Object.prototype.hasOwnProperty.call(checked, prop)) {
      transform.push({
        itemId: prop,
        accounts: checked[prop]
      });   
    }
  }
  return transform;
};

const transformData = (data) => {
  console.log(data);
  var transformedData = JSON.parse(JSON.stringify(templatedata));
  const transactions = data.getuser.getTransaction;
  for (var transaction of transactions) {
    if (transaction.__typename === "Transaction") {
      transformedData.labels.push(transaction.merchant_name === null ? 
              `transaction on ${transaction.date}` : 
              `${transaction.merchant_name} ${transaction.date}`);
    } else if (transaction.__typename === "Group") {
      transformedData.labels.push(transaction.groupid);
    }
    transformedData.datasets[0].data.push(transaction.amount);
  }
  return transformedData;
};


const BarChart = () => {
  const { checked, checkCount, startDate, endDate, groupBy} = useContext(Context);
  const [barData, setBarData] = useState();

  const { loading, error, refetch, networkStatus } = useQuery(GET_TRANSACTION, {
    notifyOnNetworkStatusChange: true,
    variables: { items : transformCheck(checked),
                 startDate,
                 endDate,
                 sort: "ASC",
                 sortBy: "DATE",
                 group: groupBy
                },
    onCompleted: (data) => {
      if (data !== undefined) {
        setBarData(transformData(data));
      }
      console.log(data);
      console.log('Bar Chart End');
    }
  });
  useEffect(() => {
    refetch({ 
      items : transformCheck(checked),
      startDate,
      endDate 
    });
  }, [checked, checkCount, startDate, endDate]);

  var state;
  if (networkStatus === NetworkStatus.refetch) {
      state = 'Refetching!'; 
  } else if (loading) {
      state = 'Loading ...' ;
  } else if (error) {
      state = `error ${error.message}`;
  }
  return (
    barData !== undefined ? <Bar data={barData} options={options}></Bar> : 'Loading...'
  )

};

export default BarChart;