import * as React from "react";
import { Link } from "react-router";
import store from "./store";
import strings from "./strings";
import { formatString } from "./string";

const styles = require<any>("./Summary.less");

export default class Summary extends React.Component<{}, {}> {
    render() { return (
        <div className={styles.summary}>
            <p>
                {formatString(
                    strings.youDidIt,
                    store.getState().numberOfCorrectTasks)}
            </p>
            <p>
                <Link
                    className={styles.retry}
                    to={"/"}
                    onClick={this.onRestart.bind(this)}>
                    {strings.retry}
                </Link>
            </p>
        </div>);
    }

    onRestart() {
        store.dispatch({ type: "restart" });
    }
}
