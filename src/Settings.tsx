import * as React from "react";
import strings from "./strings";

const pageStyles = require<any>("./Page.less");

export default class Settings extends React.Component<{}, {}> {

    render() { return (
        <div className={pageStyles.page}>
            <h1>{strings.settings}</h1>
            <ul>
                <li>
                    <a
                        target="_blank"
                        data-rel="external"
                        href="http://haz.io">
                        {strings.testBrowser}
                    </a>
                </li>
            </ul>
        </div>);
    }

}
