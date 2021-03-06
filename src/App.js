import './App.css';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import DisplayDatabase from './pages/DisplayDatabase';
import { AuthorizationContext } from './contexts/AuthorizationContext';
import { useState } from 'react';
import { DBNameContext } from './contexts/DBNameContext';
import {ConnectionContext} from './contexts/ConnectionContext';

function App() {
  const [authorized, setAuthorized] = useState(false);
  const [db_name, setDb_name] = useState("");
  const [connection, setConnection] = useState("");

  return (
    <Router>
      <AuthorizationContext.Provider value={{authorized, setAuthorized}} className="App">
      <DBNameContext.Provider value={{db_name, setDb_name}} className="App">
      <ConnectionContext.Provider value={{connection, setConnection}} className="App">

        <Switch>
          <Route exact path="/">
            <LandingPage/>
          </Route>
          <Route exact path="/db">
              <DisplayDatabase />
          </Route>
          
        </Switch>   
        </ConnectionContext.Provider>
        </DBNameContext.Provider>     
      </AuthorizationContext.Provider>
    </Router>
    
  );
}

export default App;
