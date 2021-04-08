import React, { useState, useContext, useEffect } from "react";
import Context from "../../context/Dashboard";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const getTableHeaders = (groupBy) => {
  switch (groupBy) {
    case "DAY":
      return ["day", "amount"];
    case "WEEK":
      return ["week", "amount"];
    case "MONTH":
      return ["month", "amount"];
    case "CATEGORY_1":
      return ["category", "amount"];
    case "CATEGORY_2":
      return ["detailed category", "amount"];
    case "NAME":
      return ["merchant name", "amount"];
    // eslint-disable-next-line no-fallthrough
    case "TRANSACTION":
    default:
      return ["date", "amount", "merchant name", "category"];
  }
};

const getTableData = (data) => {
  var transformData = [];
  for (var cell of data) {
    if (cell.__typename === "Transaction") {
      transformData.push([
        cell.transaction_id,
        cell.date,
        cell.amount,
        cell.merchant_name !== null ? cell.merchant_name : "unknown merchant",
        cell.category[0],
      ]);
    } else if (cell.__typename === "Group") {
      transformData.push([cell.groupid, cell.amount]);
    }
  }
  return transformData;
};

const BudgetTable = () => {
  const { groupBy, transactions } = useContext(Context);
  const [headers, setHeaders] = useState([]);
  const [data, setTableData] = useState([]);
  useEffect(() => {
    setHeaders(getTableHeaders(groupBy));
    setTableData(getTableData(transactions));
  }, [groupBy, transactions]);
  return (
    data.length > 0 ? <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => {
            if (row.length <= 2) {
              return (
                <TableRow key={row[0]}>
                  {row.map((cell) => (
                    <TableCell>{cell}</TableCell>
                  ))}
                </TableRow>
              );
            } else {
              const [id, ...rest] = row;
              return (
                <TableRow key={id}>
                  {rest.map((cell) => (
                    <TableCell>{cell}</TableCell>
                  ))}
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    </TableContainer> : 'Add or checkmark a bankaccount to see data'
  );
};
export default BudgetTable;
