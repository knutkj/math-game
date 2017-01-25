import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, IndexRoute, Route, hashHistory } from "react-router";
import App from "./src/App";
import TaskCollectionPicker from "./src/TaskCollectionPicker";
import TaskHost from "./src/TaskHost";
import Summary from "./src/Summary";
import { getNumberOfSelectedTaskCollections } from "./src/store";

//
// Importing tasks.
//
import "./src/AdditionTask.tsx";
import "./src/SubtractionTask.tsx";

const appElement = document.querySelector("#app");
if (!appElement) {
    throw new Error("Missing task element.");
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={TaskCollectionPicker} />
            <Route
                onEnter={onEnterTasks}
                onLeave={() => document.body.style.overflow = "visible"}
                path="/tasks" component={TaskHost} />
            <Route
                onEnter={(_, replace: ReactRouter.RedirectFunction) =>
                    getNumberOfSelectedTaskCollections() === 0 && replace("/")}
                path="/summary" component={Summary} />
        </Route>
    </Router>,
    appElement);

function onEnterTasks (_, replace: ReactRouter.RedirectFunction) {
    if (getNumberOfSelectedTaskCollections() === 0) {
        replace("/");
    } else {
        document.body.style.overflow = "hidden";
    }
}
