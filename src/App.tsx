import * as React from "react";

const styles = require("./App.less") as any;

export default class App extends React.Component<{}, {}> {
    render() { return (
        <div className={styles.app}>
            {this.props.children}
            <Footer />
        </div>);
    }
}

class Footer extends React.Component<{}, {}> {

    static contextTypes = { router: React.PropTypes.object.isRequired };

    render() { return (
        <footer className={styles.footer}>
            <div
                id={styles.settingsButton}
                role="button"
                onClick={() => this.onSettings()}>

                <img src={require<string>("../images/2699.svg")} />
            </div>
        </footer>);
    }

    onSettings() {
        this.context.router.push("/settings");
    }
}
