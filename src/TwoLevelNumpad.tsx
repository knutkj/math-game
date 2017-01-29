import { range } from "underscore";
import * as React from "react";
import store from "./store";

const styles = require<any>("./Numpad.less");

interface ITwoLevelNumpadState {
    readonly start: number | null;
}

export default class TwoLevelNumpad
    extends React.Component<{}, ITwoLevelNumpadState> {

    constructor() {
        super();
        this.state = { start: null };
    }

    render() {
        return this.state.start === null ?
            this.renderFirstLevel() :
            this.renderSecondLevel();
    }

    renderFirstLevel() { return (
        <ul className={styles.numpad}>
            {getKeys().map(n =>
            <li key={n}>
                <div role="button" onClick={() => this.onFirstLevelClick(n)}>
                    {n*10}
                </div>
            </li>)}
        </ul>);
    }

    onFirstLevelClick(n: number) {
        this.setState({ start: n });
    }

    renderSecondLevel() { return (
        <ul className={styles.numpad}>
            {getKeys().map(n => n + this.state.start * 10).map(n =>
            <li key={n}>
                <div role="button" onClick={() => this.onSecondLevelClick(n)}>
                    {n}
                </div>
            </li>)}
        </ul>);
    }

    onSecondLevelClick(n: number) {
        this.setState({ start: null });
        store.dispatch({ type: "answer-suggested", value: n });
    }

}

export function getKeys() {
    return range(0, 11);
}
