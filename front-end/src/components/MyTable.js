import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

const labels = ["datid", "datname", "numbackends", "xact_commit", 
"xact_rollback", "blks_read", "blks_hit", "tup_returned", "tup_fetched", 
"tup_inserted", "tup_updated", "tup_deleted" ,"conflicts", "temp_files", 
"temp_bytes", "deadlocks", "checksum_failures","checksum_last_failure",
"blk_read_time", "blk_write_time", "stats_reset"]

function reformateData(data) {
    var rows = [];
    var i;
    for (i = 0; i < data.length; i++) {
        rows.push({label: labels[i], data: data[i]})
    }
    return rows
}

export default function MyTable({data}) {
    console.log("in my table, ", data.length)
    const rows = reformateData(data);
  return (
    <TableContainer component={Paper}>
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