import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, IndexRoute, Route, hashHistory } from "react-router";
import App from "./src/App";
import TaskCollectionPicker from "./src/TaskCollectionPicker";
import TaskHost from "./task";

//
// Importing tasks.
//
import "./addition.tsx";
import "./subtraction.tsx";

const appElement = document.querySelector("#app");
if (!appElement) {
    throw new Error("Missing task element.");
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={TaskCollectionPicker} />
            <Route path="/tasks" component={TaskHost} />
        </Route>
    </Router>,
    appElement);
