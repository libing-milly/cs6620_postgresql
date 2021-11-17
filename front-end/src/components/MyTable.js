import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const labels = ["Database oid", "Database name", "Number of backends/connections",
 "Number of commits", "Number of rollback", "Number of disk blocks read", 
 "Number of disk blocks hit", "Number of rows returned by queries", "Number of rows fetched by queries", 
"Number of rows inserted by queries", "Number of rows updated by queries", 
"Number of rows deleted by queries" ,"Number of queries canceled due to conflicts", 
"Number of temporary files created by queries", "Total amount of data written to temporary files by queries", 
"Number of deadlocks detected", "Checksum failures","Checksum last failure",
"Time spent reading data file blocks by backends", "Time spent writing data file blocks by backends"]

function reformateData(data) {
    var rows = [];
    var i;
    for (i = 0; i < labels.length; i++) {
        rows.push({label: labels[i], data: data[i]})
    }
    return rows
}

export default function MyTable(props) {
    console.log("in my table, ", props.data.length)
    const rows = reformateData(props.data);
  return (
    <TableContainer component={Paper} sx={{ visibility: props.visibility, display: props.display}}>
        <Typography variant="h4" gutterBottom component="div">
          Database Statistics
        </Typography>
      <Table sx={{ minWidth: 650 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Database Statistics Label</StyledTableCell>
            <StyledTableCell align="right">Data</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow
              key={row.label}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {row.label}
              </StyledTableCell>
              <StyledTableCell align="right">{row.data}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}