import * as React from "react";
import { Link } from "react-router";
import store from "./store";

const styles = require<any>("./Summary.less");

export default class Summary extends React.Component<{}, {}> {
    render() { return (
        <div className={styles.summary}>
            <p>
                Du klarte {store.getState().numberOfCorrectTasks} oppgaver!
                Bra jobba!
            </p>
            <p>
                <Link
                    className={styles.retry}
                    to={"/"}
                    onClick={this.onRestart.bind(this)}>
                    Prøv på nytt
                </Link>
            </p>
        </div>);
    }

    onRestart() {
        store.dispatch({ type: "restart" });
    }
}
