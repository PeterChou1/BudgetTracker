import './../styles/App.css';
import { Switch, Route } from 'react-router-dom';
import Login from './Login/Login';
import ItemList from './ItemList/ItemList';


function App() {
  return (
    <div className="App">
        <Switch>
          <Route exact path="/" component={Login} ></Route>
          <Route exact path="/items" component={ItemList} ></Route>
        </Switch>
    </div>
  );
}


export default App;
