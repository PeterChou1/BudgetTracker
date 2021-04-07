import "./../styles/App.css";
import { Switch, Route } from "react-router-dom";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import { DashboardProvider } from "../context/Dashboard";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <DashboardProvider>
          <Route exact path="/items" component={Dashboard}></Route>
        </DashboardProvider>
      </Switch>
    </div>
  );
}

export default App;
