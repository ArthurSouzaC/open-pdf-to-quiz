import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { SendFile } from "./screens/SendFile";
import { Quiz } from "./screens/Quiz";
import { Results } from "./screens/Results";

function App() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={SendFile} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/results" component={Results} />

        <Route>404: No such page!</Route>
      </Switch>
    </Router>
  );
}

export default App;
