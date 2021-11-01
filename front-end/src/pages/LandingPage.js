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

const theme = createTheme();
const Name = createContext();


function LandingPage() {
  const {authorized, setAuthorized} = React.useContext(AuthorizationContext)
  const [create_database, setCreate_database] = React.useState(false);
  const [access_database, setAccess_database] = React.useState(false);
  const {db_name, setDb_name} = React.useContext(DBNameContext);
  const [input, setInput] = React.useState("");
  const [response, setResponse] = React.useState('enter database name');
  const history = useHistory();

  MyButton.propTypes = {
    color: PropTypes.oneOf(['blue', 'red']).isRequired,
  };

  const handleCreation = () => {
    if (input.length === 0){
      setResponse('please enter database name');
      return;
    }
    try{
      ClientService.getInstance().create(input)
      .then(res => setResponse(res))
      .catch(setResponse('error'))
      
      toDisplayDatabase();
    }catch{
      setResponse("failed to create a databse")
    }
    return; 
  
  }
  
  const handleAccess = () => {
    if (input.length === 0){
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

  const toDisplayDatabase = () => {
    setAuthorized(true)
    setDb_name(input)
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
              <MyButton color="blue" onClick={handleOpenAccessDatabase}>Access Database</MyButton>
              <MyButton color="red" onClick={handleOpenCreateDatabase}>Create Database</MyButton>
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
                    autoFocus
                    id="create name"
                    variant="standard"
                    fullWidth='md'
                    onChange = {(e) => setInput(e.target.value)}
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
                  <DialogContentText>
                    {response}
                  </DialogContentText>
                  <TextField
                    autoFocus
                    id="access name"
                    variant="standard"
                    fullWidth='md'
                    onChange = {(e) => setInput(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseAccessDatabase}>Cancel</Button>
                  <Button onClick={handleAccess}>Access</Button>
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