import { indexBy, flatten, unique } from "underscore";
import * as React from "react";
import { Link } from "react-router";
import { ITaskCollection } from "../taskCollections/reducer";
import { ITask } from "../Task";
import store from "../store";

const styles = require<any>("./TaskCollectionPicker.css");

interface ITaskCollectionPickerState {
    taskCollections: ReadonlyArray<ITaskCollection>;
}

export default class TaskCollectionPicker
    extends React.Component<{}, ITaskCollectionPickerState>
    implements React.ComponentLifecycle<{}, ITaskCollectionPickerState> {

    unsubscribe: () => void;

    constructor() {
        super();
        this.state = { taskCollections: store.getState().taskCollections };
    }

    componentWillMount() {
        this.unsubscribe = store.subscribe(() =>
            this.setState({
                taskCollections: store.getState().taskCollections
            })
        );
    }

    render() {
        return (
            <div>
                <h1>velg oppgaver</h1>
                <ul className={styles.taskCollectionList}>
                    {this.state.taskCollections.map((t, i) =>
                    <TaskCollection key={i} name={t.name}/>)}
                </ul>
                <CommandBar />
                <TaskList />
            </div>);
    }

    shouldComponentUpdate(_, newState: ITaskCollectionPickerState) {
        return this.state.taskCollections !== newState.taskCollections;
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

}

//
// TaskCollection component.
//

interface ITaskCollectionProps {
    readonly name: string;
}

interface ITaskCollectionState {
    readonly checked: boolean;
}

class TaskCollection extends
    React.Component<ITaskCollectionProps, ITaskCollectionState> {

    constructor(props: ITaskCollectionProps) {
        super();
        this.state = {
            checked: store
                .getState()
                .selectedTaskCollections
                .indexOf(props.name) !== -1
        };
    }

    render() {
        return (
            <li
                className={styles.taskCollection}
                role="checkbox"
                aria-checked={this.state.checked}>
                <a href="#" onClick={this.onClick.bind(this)}>
                    {this.props.name}
                </a>
            </li>);
    }

    onClick() {
        const isSelected = this.state.checked;
        this.setState({ checked: !isSelected });
        store.dispatch({
            type: isSelected ?
                "task-collection-unselected" :
                "task-collection-selected",
            value: this.props.name });
    }
}

//
// TaskList component.
//

interface ITaskListState {
    readonly selectedTaskCollections: ReadonlyArray<string>;
}

class TaskList extends React.Component<{}, ITaskListState>  {

    unsubscribe: () => void;

    constructor() {
        super();
        this.state = {
            selectedTaskCollections: store.getState().selectedTaskCollections
        };
    }

    componentWillMount() {
        this.unsubscribe = store.subscribe(() => this.setState({
            selectedTaskCollections: store.getState().selectedTaskCollections
        }));
    }

    render() {
        const selected = this.state.selectedTaskCollections;
        if (selected.length === 0) {
            return null;
        }
        const index = indexBy(store.getState().taskCollections, c => c.name);
        const tasks = flatten(selected.map(c => index[c]).map(c => c.tasks))
            .sort((t1: ITask, t2: ITask) => {
                const t1Numbers = t1.getNumbers();
                const t2Numbers = t2.getNumbers();
                for (let i = 0; i < t1Numbers.length; i++) {
                    if (t1Numbers[i] === t2Numbers[i]) {
                        continue;
                    }
                    if (t1Numbers[i] < t2Numbers[i]) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
                return t1Numbers.length - t2Numbers.length;
            })
            .map(t => t.task);

        return (
            <div>
                <div role="separator">-----</div>
                <div className={styles.taskList}>
                    {unique(tasks).join(" ")}
                </div>
            </div>
        );
    }

    shouldComponentUpdate(_, newState: ITaskListState) {
        return this.state.selectedTaskCollections !== newState.selectedTaskCollections;
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
}

//
// CommandBar component.
//

interface ICommandBarState {
    readonly selectedTaskCollections: ReadonlyArray<string>;
    readonly startedAt: Date | null;
}

class CommandBar extends React.Component<{}, ICommandBarState> {

    unsubscribe: () => void;

    constructor() {
        super();
        this.state = {
            selectedTaskCollections: store.getState().selectedTaskCollections,
            startedAt: store.getState().startedAt
        };
    }

    componentWillMount() {
        this.unsubscribe = store.subscribe(() => this.setState({
            selectedTaskCollections: store.getState().selectedTaskCollections,
            startedAt: store.getState().startedAt
        }));
    }

    render() {
        return this.state.selectedTaskCollections.length > 0 ?
            <div>
                <div role="separator">-----</div>
                <div className={styles.commandBar}>
                    {!this.state.startedAt ?
                    <Link
                        className={styles.startButton}
                        to="/tasks"
                        onClick={this.onStart.bind(this)}>Start</Link> :
                    <Link
                        className={styles.startButton}
                        to="/tasks">Fortsett</Link>}
                </div>
            </div> : null;
    }

    onStart() {
        store.dispatch({ type: "start" });
    }

    shouldComponentUpdate(_, newState: ICommandBarState) {
        return (
            this.state.selectedTaskCollections !==
                newState.selectedTaskCollections ||
            this.state.startedAt !== newState.startedAt
        );
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
}
