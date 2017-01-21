import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router, IndexRoute, Route, hashHistory } from "react-router";
import App from "./src/App";
import TaskCollectionPicker from "./src/TaskCollectionPicker";
import "./addition.tsx";
import "./subtraction.tsx";
//import { setTask, pickTasks } from "./task";

const taskElement = document.querySelector("#task");
if (!taskElement) {
    throw new Error("Missing task element.");
}


ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={TaskCollectionPicker} />
        </Route>
    </Router>,
    taskElement);

//pickTasks(function () {
//    setTask();
//});
