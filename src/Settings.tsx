/// <reference types="cordova-plugin-inappbrowser" /> 

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
                        href="http://haz.io"
                        onClick={e => this.onTestBrowser(e)}>
                        {strings.testBrowser}
                    </a>
                </li>
            </ul>
        </div>);
    }

    onTestBrowser(e: React.MouseEvent<HTMLAnchorElement>) {
        if (window.cordova && cordova["InAppBrowser"]) {
            e.preventDefault();
            const inAppBrowser: InAppBrowser = cordova["InAppBrowser"];
            inAppBrowser.open(e.currentTarget.href, "_blank", "location=yes");
        }
    }

}
