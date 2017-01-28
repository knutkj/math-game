import { range } from "underscore";
import * as React from "react";
import store from "./store";

const styles = require<any>("./Numpad.less");

export default class Numpad extends React.Component<{}, {}> {

    render() { return (
        <ul className={styles.numpad}>
            {range(1, 11).map(n =>
            <li key={n}>
                <div role="button" onClick={() => this.onClick(n)}>
                    {n}
                </div>
            </li>)}
        </ul>);
    }

    onClick(n: number) {
        store.dispatch({ type: "answer-suggested", value: n });
    }

}
