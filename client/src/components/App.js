import './../styles/App.css';
import { Switch, Route } from 'react-router-dom';
import Login from './Login/Login';
import ItemList from './ItemList/ItemList';
import { ItemListProvider } from '../context/itemListContext';

function App() {
  return (
    <div className="App">
        <Switch>
          <Route exact path="/" component={Login} ></Route>
          <ItemListProvider>
            <Route exact path="/items" component={ItemList} ></Route>
          </ItemListProvider>
        </Switch>
    </div>
  );
}


export default App;
