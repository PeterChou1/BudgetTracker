import React, { useEffect, useContext, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useQuery, gql, NetworkStatus } from '@apollo/client';
import Context from "../../context/Dashboard";
var templatedata = {
  labels: [],
  datasets: [
    {
      label: 'Transaction Bar Chart',
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
                     $sort: SortBy,
                     $group: GroupBy,
                     $skip: Int,
                     $take: Int)  {
    getuser {
      getTransaction(items: $items,
                     startDate: $startDate,
                     endDate: $endDate,
                     sort: $sort,
                     group: $group,
                     skip: $skip,
                     take: $take) {
                     amount
                     merchant_name
                     date
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
    if (transaction.merchant_name === null) {
      transformedData.labels.push(`transaction on ${transaction.date}`);
    } else {
      transformedData.labels.push(`${transaction.merchant_name} ${transaction.date}`);
    }
    transformedData.datasets[0].data.push(transaction.amount);
  }
  return transformedData;
};

const BarChart = () => {
  const { checked, checkCount, startDate, endDate } = useContext(Context);
  const [barData, setBarData] = useState();

  const { loading, error, refetch, networkStatus } = useQuery(GET_TRANSACTION, {
    notifyOnNetworkStatusChange: true,
    variables: { items : transformCheck(checked),
                 startDate: "2020-01-01",
                 endDate: "2020-02-10" },
    onCompleted: (data) => {
      console.log('Bar Chart Retrieve');
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