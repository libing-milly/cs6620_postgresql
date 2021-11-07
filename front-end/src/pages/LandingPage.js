import React, {createContext, useContext} from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ClientService from '../services/service';
import { BrowserRouter as Route, useHistory} from 'react-router-dom';
import MyToolbar from '../components/MyToolbar';
import MyButton from '../components/MyButton';
import PropTypes from 'prop-types';
import DisplayDatabase from './DisplayDatabase';
import { AuthorizationContext } from '../contexts/AuthorizationContext';
import { DBNameContext } from '../contexts/DBNameContext';
import { ConnectionContext } from '../contexts/ConnectionContext';

const theme = createTheme();
const Name = createContext();


function LandingPage() {
  const {setAuthorized} = React.useContext(AuthorizationContext)
  const {connection, setConnection} = React.useContext(ConnectionContext)
  const [create_database, setCreate_database] = React.useState(false);
  const [access_database, setAccess_database] = React.useState(false);
  const [delete_database, setDelete_database] = React.useState(false);
  const {setDb_name} = React.useContext(DBNameContext);
  const [nameInput, setNameInput] = React.useState("");
  const [userInput, setUserInput] = React.useState("");
  const [response, setResponse] = React.useState('');

  const [deleteRes, setDeleteRes] = React.useState("Only database owener have the right to delete");
  const [deleteDBNameInput, setDeleteDBNameInput] = React.useState("");
  const [deleteUserInput, setDeleteUserInput] = React.useState("");
  const [deletePswInput, setDeletePswInput] = React.useState("");
  const history = useHistory();

  MyButton.propTypes = {
    color: PropTypes.oneOf(['blue', 'red','green']).isRequired,
  };

  const handleCreation = () => {
    if (nameInput === null || userInput === null ||
      userInput.length === 0 || nameInput.length === 0){
      setResponse('please enter database name');
      return;
    }
    try{
      setResponse('sending request...')
      ClientService.getInstance().create(nameInput, userInput)
      .then(res => setConnection("host:" + res.host + "\nport:" + res.port + 
      "\nuser:" + res.username + "\npassword:" + res.password))
      .catch(setResponse('error'))
      
      setResponse("database successfully created")
      toDisplayDatabase();
    }catch{
      setResponse("failed to create a databse")
    }
    return; 
  
  }
  
  const handleAccess = () => {
    if (nameInput === null ||
       nameInput.length === 0){
      setResponse('please enter database name');
      return;
    }
    try {
      // TODO: axios request to server
      toDisplayDatabase();
    }catch{
      setResponse("failed to access, try again.")
    }
    return;
  }


  const handleDeletion = () => {
    try{
      setDeleteRes('sending request...')
      // TODO: delete api need to take username and password
      /*
      ClientService.getInstance().delete(deleteDBNameInput)
      .then(res => setDeleteRes.set(res))
      .catch(setDeleteRes('error deleting'))
      */
      setDeleteRes("database successfully deleted")
      
    }catch{
      setDeleteRes("failed to create a databse")
    }
    return; 
  
  }

  const toDisplayDatabase = () => {
    setAuthorized(true)
    setDb_name(nameInput)
    setConnection("")
    history.push("/db")
    
  }

  const handleOpenCreateDatabase = () => {
    setCreate_database(true);
  };

  const handleCloseCreateDatabase = () => {
    setCreate_database(false);
  };

  const handleOpenAccessDatabase = () => {
    setAccess_database(true);
  };

  const handleCloseAccessDatabase = () => {
    setAccess_database(false);
  };
  const handleOpenDeleteDatabase = () => {
    setDelete_database(true);
  };

  const handleCloseDeleteDatabase = () => {
    setDelete_database(false);
  };


  return (
    <div>
    <MyToolbar title="Welcome"/>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="md">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"         
              gutterBottom
            >
              PostgreSQL as a containerized service
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
                We provide services that store your PostgreSQL data on a remote server that it is easy to scale up or down. 
                Our fault tolerance techniques enable seamless recovery your data when a server is down.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <MyButton color="green" onClick={handleOpenAccessDatabase}>Access Database</MyButton>
              <MyButton color="blue" onClick={handleOpenCreateDatabase}>Create Database</MyButton>
              <MyButton color="red" onClick={handleOpenDeleteDatabase}>Delete Database</MyButton>
              </Stack>
              <Dialog open={create_database} 
                nClose={handleCloseCreateDatabase}
                fullWidth='md'
              >
                <DialogTitle>Create Database</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {response}
                  </DialogContentText>
                  <TextField
                    required
                    autoFocus
                    id="create-db-name"
                    variant="standard"
                    fullWidth='md'
                    label="database name required"
                    onChange = {(e) => setNameInput(e.target.value)}
                  />
                  <TextField
                    autoFocus
                    required
                    id="create-username"
                    variant="standard"
                    fullWidth='md'
                    label="user name required"
                    onChange = {(e) => setUserInput(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseCreateDatabase}>Cancel</Button>
                  <Button onClick={handleCreation}>Create</Button>
                </DialogActions>
              </Dialog>

              <Dialog open={access_database}
               onClose={handleCloseAccessDatabase}
               fullWidth='md'
               >
                <DialogTitle>Access Database</DialogTitle>
                <DialogContent>
              
                  <TextField
                    autoFocus
                    required
                    id="access name"
                    label="database name required"
                    variant="standard"
                    fullWidth='md'
                    onChange = {(e) => setNameInput(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseAccessDatabase}>Cancel</Button>
                  <Button onClick={handleAccess}>Access</Button>
                </DialogActions>
              </Dialog>

              <Dialog open={delete_database}
               onClose={handleCloseDeleteDatabase}
               fullWidth='md'
               >
              <DialogTitle>Delete Database</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {deleteRes}
                  </DialogContentText>
                  <TextField
                    autoFocus
                    required
                    id="delete-db-name"
                    label="database name required"
                    variant="standard"
                    fullWidth='md'
                    onChange = {(e) => setDeleteDBNameInput(e.target.value)}
                  />
                  <TextField
                    autoFocus
                    required
                    id="delete-username"
                    label="username required"
                    variant="standard"
                    fullWidth='md'
                    onChange = {(e) => setDeleteUserInput(e.target.value)}
                  />
                  <TextField
                    autoFocus
                    required
                    type="password"
                    id="delete-password"
                    label="password requried"
                    variant="standard"
                    fullWidth='md'
                    onChange={(e) => setDeletePswInput(e.target.value)}
                  />
                  
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDeleteDatabase}>Cancel</Button>
                  <Button onClick={handleDeletion}>Delete</Button>
                </DialogActions>
              </Dialog>

          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Footer
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
      
    </div>
  );
}

export default LandingPage;
export { Name };