import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, useTheme } from '@mui/material/styles';
import useDB from '../hooks/useDB';
import ClientService from '../services/service';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Name } from './LandingPage';
import { Redirect } from 'react-router';
import { AuthorizationContext } from '../contexts/AuthorizationContext';
import { DBNameContext } from '../contexts/DBNameContext';
import MyTable from '../components/MyTable';
import { Stack } from '@mui/material';
import { Container } from '@mui/material';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const drawerWidth = 180;
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function DisplayDatabase() {
  const {authorized} = React.useContext(AuthorizationContext)
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [response,setResponse] = React.useState();
  const [db_to_delete, setDb_to_delete] = React.useState('');
  const [delete_database, setDelete_database] = React.useState(false);
  const {db_name, setDb_name} = React.useContext(DBNameContext);
  const [size, setSize] = React.useState("");
  const [stats, setStats] = React.useState("");
  const [main_content, setMain_content] = React.useState("");

  const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    }),
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenDeleteDatabase = () => {
    setDelete_database(true);
  };

  const handleCloseDeleteDatabase = () => {
    setDelete_database(false);
  };

  const handleDeleteDB = () => {
    if (db_to_delete !== db_name){
      setResponse("please enter the correct name")
      return;
    }
    try{
      console.log('sending delete request '+db_to_delete)
      setResponse('deletion request sent, db name' + db_to_delete) 
      ClientService.getInstance().delete(db_to_delete)
      .then(res => setResponse(res))
      .catch(setResponse('error'))
      
    }catch{
      setResponse("failed to create a databse:" + response)
    }
    return; 
  
  }
    
    
    const handleGetSize = () => {
      try{
        console.log('sending get size request '+db_name)
        setResponse('get size request sent, db name' + db_name) 
        ClientService.getInstance().getSize(db_name)
        .then(res => setSize(res))
        .catch(setSize('error'))
        
      }catch{
        setSize("failed to retrieve size of databse:" + response)
      }
      return;  
    }
    
    const reformateStats = (str) => {
      var res = str.slice(2,-2);
       res = res.split(",")
      return res
    }

    const handleGetStats = () => {
      try{
        console.log('sending get stats request '+db_name)
        setResponse('get stats request sent, db name' + db_name) 
        ClientService.getInstance().getStats(db_name)
        .then(res => setStats(reformateStats(res)))
        .catch(setStats('error'))
        
      }catch{
        setStats("failed to retrieve stats of databse:" + response)
      }
      return;  
    }

    useEffect(() => {
      if (!authorized) {
        return <Redirect to="/"/>;
      }
      handleGetSize(db_name);
      handleGetStats(db_name);
      setMain_content("Current database usage: " + size);
    },[authorized, db_name]);


    return(
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Database Overview
          </Typography>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          {db_name}
          </Typography>
          <Button href="/" color="inherit">Home</Button>
          
        </Toolbar>
        
      </AppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >

        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />      
          
            <List>
              <ListItem button key='Usage'>
                  <ListItemText primary='Usage' onClick={handleGetSize}/>
                </ListItem>
                <ListItem button key='Statistics'>
                  <ListItemText primary='Statistics' onClick={handleGetStats}/>
                </ListItem>
                <ListItem button key='Settings'>
                  <ListItemText primary='Settings' />
                </ListItem>
              
            </List>
            <Divider/>
            <List>
              <Button variant="contained" color='error' onClick={handleOpenDeleteDatabase}>Delete Database</Button>
            </List>
          
        </Drawer>
        <Main open={open}>
        <DrawerHeader />
        <Typography variant="h4" gutterBottom component="div">
          DataBase: {db_name} Size: {size}
        </Typography>
        <MyTable data={stats}/>

        </Main>
        <Dialog open={delete_database}
               onClose={handleCloseDeleteDatabase}
               fullWidth='md'
               >
                <DialogTitle>Delete Database</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {response}
                  </DialogContentText>
                  <TextField
                    autoFocus
                    id="delete name"
                    variant="standard"
                    fullWidth='md'
                    onChange = {(e) => setDb_to_delete(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDeleteDatabase}>Cancel</Button>
                  <Button onClick={handleDeleteDB}>Delete</Button>
                </DialogActions>
              </Dialog>
                      
      </Box>
    )
}