import { range } from "underscore";
import * as React from "react";
import store from "./store";

const styles = require<any>("./TwoLevelNumpad.less");

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
        <ul className={styles.twoLevelNumpad}>
            {getKeys().map(n =>
            <li className={styles.item} key={n}>
                <FirstLevelKey
                    label={n}
                    onClick={() => this.onFirstLevelClick(n)} />
            </li>)}
            <li className={styles.item} key={100}>
                <SecondLevelKey
                    label={100}
                    onClick={() => this.onSecondLevelClick(100)} />
            </li>
        </ul>);
    }

    renderSecondLevel() { return (
        <ul className={styles.twoLevelNumpad}>
            <li className={styles.item} key="back">
                <SecondLevelKey
                    label=".."
                    onClick={() => this.onBackToFirstLevelClick()} />
            </li>
            {getKeys().map(n => n + this.state.start * 10).map(n =>
            <li className={styles.item} key={n}>
                <SecondLevelKey
                    label={n}
                    onClick={() => this.onSecondLevelClick(n)} />
            </li>)}
        </ul>);
    }

    onFirstLevelClick(n: number) {
        this.setState({ start: n });
    }

    onSecondLevelClick(n: number) {
        this.setState({ start: null });
        store.dispatch({ type: "answer-suggested", value: n });
    }

    onBackToFirstLevelClick() {
        this.setState({ start: null });
    }

}

export function getKeys() {
    return range(0, 10);
}

const FirstLevelKey = ({label, onClick}) =>
    <div
        className={styles.firstLevelKey}
        role="button"
        onClick={onClick}>
        <div className={styles.key}></div>
        <div className={styles.key}></div>
        <div className={styles.key}>{`${label}..`}</div>
    </div>;

const SecondLevelKey = ({label, onClick}) =>
    <div
        className={styles.secondLevelKey}
        role="button" onClick={onClick}>
        {label}
    </div>;
