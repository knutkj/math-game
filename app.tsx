import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, IndexRoute, Route, hashHistory } from "react-router";
import App from "./src/App";
import TaskCollectionPicker from "./src/TaskCollectionPicker";
import TaskHost from "./src/TaskHost";
import Summary from "./src/Summary";
import Settings from "./src/Settings";
import { getNumberOfSelectedTaskCollections } from "./src/store";
import store from "./src/store";

//
// Importing tasks.
//
import "./src/AdditionTask.tsx";
import "./src/SubtractionTask.tsx";

const appElement = document.querySelector("#app");
if (!appElement) {
    document.write("Missing task element.");
    throw new Error("Missing task element.");
}

//
// Signals that Cordova's device APIs have loaded and are ready to access.
//
document.addEventListener(
    "deviceready",
    () => store.dispatch({ type: "device-ready" }),
    false);

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

            <Route path="/settings" component={Settings} />
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
