import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function MyToolbar() {
  const [title, setTitle] = React.useState('Welcome');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography href="/" variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Button href="/" color="inherit">Home</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
