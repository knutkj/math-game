import * as React from "react";

const styles = require("./App.css") as any;

export default class App extends React.Component<{}, {}> {
    render() { return (
        <div className={styles.app}>
            {this.props.children}
        </div>);
    }
}