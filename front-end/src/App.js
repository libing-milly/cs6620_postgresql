import './App.css';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import DisplayDatabase from './pages/DisplayDatabase';
import MyToolbar from './components/MyToolbar';
function App() {
  

  return (
    <Router>
      <div className="App">
        <MyToolbar/>
        <Switch>
          <Route exact path="/">
            <LandingPage/>
          </Route>
          <Route path="db">
            <DisplayDatabase/>
          </Route>
        </Switch>        
      </div>
    </Router>
    
  );
}

export default App;
