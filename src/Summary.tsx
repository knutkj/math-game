import * as React from "react";
import { Link } from "react-router";
import store from "./store";

export default class Summary extends React.Component<{}, {}> {
    render() { return (
        <div>
            <div>
                <Link to={"/"} onClick={this.onRestart.bind(this)}>
                    Prøv på nytt
                </Link>
            </div>
        </div>);
    }

    onRestart() {
        store.dispatch({ type: "unselect-all-task-collections" });
    }
}
