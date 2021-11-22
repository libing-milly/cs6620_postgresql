import React, { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
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
import ClientService from '../services/service';
import { Redirect } from 'react-router';
import { AuthorizationContext } from '../contexts/AuthorizationContext';
import { DBNameContext } from '../contexts/DBNameContext';
import MyTable from '../components/MyTable';
import { ConnectionContext } from '../contexts/ConnectionContext';
import MyModal from '../components/MyModal';
import MyPgAdmin from '../components/MyPgAdmin';

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
  const {connection} = React.useContext(ConnectionContext)
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [response] = React.useState();
  const {db_name} = React.useContext(DBNameContext);
  const [size, setSize] = React.useState("");
  const [stats, setStats] = React.useState("");
  const [statsVisible, setStatsVisible] = React.useState('hidden');
  const [statsDisplay, setStatsDisplay] = React.useState('none');
  const [pgAdminDisplay, setPgAdminDisplay] = React.useState('none');
  const [pgAdminVisible, setPgAdminVisible] = React.useState('hidden');

  // const connection = "connection from display"

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
      
  const handleGetSize = () => {
      try{
        console.log('sending get size request '+db_name)
        ClientService.getInstance().getSize(db_name)
        .then(res => setSize(res))
        .catch(setSize('error'))
        
      }catch{
        setSize("failed to retrieve size of databse:" + response)
      }
      return;  
    }
    
    const reformateStats = (str) => {
      if(str === null || str.length === 0) {
        return "";
      }
      var res = str.slice(2,-2);
       res = res.split(",")
      return res
    }

    const handleGetStats = () => {
      setStatsVisible('visible')
      setStatsDisplay('block')
      setPgAdminDisplay('none')
      setPgAdminVisible('hidden')
      try{
        console.log('sending get stats request '+db_name)
        ClientService.getInstance().getStats(db_name)
        .then(res => setStats(reformateStats(res)))
        .catch(setStats('error'))
        
      }catch{
        setStats("failed to retrieve stats of databse:" + response)
      }
      return;  
    }

    const handleOpenPGAdmin = () => {
      setStatsVisible('hidden')
      setStatsDisplay('none')
      setPgAdminDisplay('block')
      setPgAdminVisible('visible')
      try{
        console.log('showing pgadmin web console')
        
      }catch{
        setStats("failed to show pgadmin web console")
      }
      return;  
    }

    useEffect(() => {
      if (!authorized) {
        return <Redirect to="/"/>;
      }
      if (connection != null){

      }
      handleGetStats(db_name);
      handleGetSize(db_name);
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
            <ListItem button key='Usage' onClick={handleGetSize}>
              <MyModal name="Usage" title="Current Database Usage" body={size} /> 
            </ListItem>
            <ListItem button key='Statistics'>
              <ListItemText primary='Statistics' onClick={handleGetStats}/>
            </ListItem>
            <ListItem button key='Connection'>
              <MyModal name="Connection" title="Connection Properties" body={connection} />                
            </ListItem>
            <ListItem button key="pgadmin">
              <ListItemText primary="pgadmin" onClick={handleOpenPGAdmin} />    
            </ListItem>
            
          </List>
            
          
        </Drawer>
        <Main open={open}>
        <DrawerHeader />
        
        <Box component="div">     
          <MyTable data={stats} visibility={statsVisible} display={statsDisplay}/>
          <MyPgAdmin visibility={pgAdminVisible} display={pgAdminDisplay} username="user 1"/>
        </Box>
        

        </Main>
        
      </Box>
    )
}