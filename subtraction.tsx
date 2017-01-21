import { range } from "underscore";
import * as React from "react";
import { ITaskProps, /*ITask,*/ taskCollections } from "./task";
import createTasks from "./src/createTasks";
const styles = require("./subtraction.css");

interface ISubtractionTaskProps extends ITaskProps {
    task: string;
}

//interface ISubtractionTask extends ITask<ISubtractionTaskProps> {}

class SubtractionTask
    extends React.Component<ISubtractionTaskProps, { value?: string, wrong?: boolean }> {

    element: HTMLInputElement;
    left: number;
    right: number;
    answer: number;
    done: boolean;

    constructor(props: ISubtractionTaskProps) {
        super(props);
        this.state = { value: "", wrong: false };
        this.setMembersFromProps(props);
    }

    componentWillReceiveProps(newProps) {
        this.setState({ value: "", wrong: false });
        this.setMembersFromProps(newProps);
    }

    render() {
        return (
            <form className={styles.task}>
                <div id="task">{this.props.task}=</div>
                <input
                    ref={e => this.element = e}
                    id="answer"
                    onChange={this.onChange.bind(this)}
                    value={this.state.value}
                    type="number"
                    maxLength={2} />
                {this.state.wrong ?
                <div className={styles.help}>
                    {this.getHelp()}
                </div> :
                null}
            </form>
        );
    }

    getHelp() {
        const items = [];
        let currentAnswer = parseInt(this.state.value || "-1", 0);
        for (var i = 0; i < this.left; i++) {
            const classNames = [
                styles.helpItem,
                i < currentAnswer ?
                    styles.answer :
                    "",
                i < this.answer ?
                    styles.left :
                    styles.right
            ].join(" ");
            items.push(
                <span key={i} className={classNames}>
                    {i + 1}
                </span>
            );
        }
        return items;
    }

    componentDidMount() {
        this.element.focus();
    }

    componentDidUpdate() {
        !this.done && this.element.focus();
    }

    onChange() {
        const value = this.element.value;

        this.setState({ value: value.substr(0, 2) });

        const numberOfChars = value.length;
        const parsedValue = parseInt(this.element.value, 10);

        if (numberOfChars === 0) {
            this.props.onReset();
        } else if (parsedValue === this.answer) {
            this.done = true;
            this.props.onCorrect();
        } else if (numberOfChars === ("" + this.answer).length) {
            this.props.onWrong();
            this.setState({ wrong: true });
        }
    }

    setMembersFromProps(props: ISubtractionTaskProps) {
        this.done = false;
        const task = props.task;
        this.left = parseInt(task.split("-")[0], 0);
        this.right = parseInt(task.split("-")[1], 0);
        this.answer = this.left - this.right;
    }
}

taskCollections.push({
    name: "Minus 0-10",
    tasks: createTasks(
        createSubtractionStrings(0, 10),
        SubtractionTask)
});

taskCollections.push({
    name: "Minus 10-20",
    tasks: createTasks(
        createSubtractionStrings(10, 20),
        SubtractionTask)
});

taskCollections.push({
    name: "Minus 0-20",
    tasks: createTasks(
        createSubtractionStrings(0, 20),
        SubtractionTask)
});

function createSubtractionStrings(start: number, stop: number) {
    const strings: string[] = [];
    for (let i = start; i <= stop; i++) {
        strings.push.apply(
            strings,
            range(0, stop)
                .filter(n => n <= i)
                .map(n => `${i}-${n}`));
    }
    return strings;
}
