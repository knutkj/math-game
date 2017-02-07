/// <reference types="cordova" />
/// <reference types="cordova-plugin-inappbrowser" />

import * as React from "react";
import { formatString } from "../string";
import strings from "../strings";

declare global {
    interface Cordova {
        InAppBrowser: InAppBrowser;
    }
}

const pageStyles = require<any>("../Page.less");

export interface ISettingsProps {
    readonly deviceReady: boolean;
}

export default class Settings extends React.Component<ISettingsProps, {}> {

    render() { return (
        <div className={pageStyles.page}>
            <h1>{strings.settings}</h1>
            <ul>
                {window.cordova ?
                <li>
                    {formatString(strings.cordovaVersion, cordova.version)}
                </li> : null}
                {window.cordova ?
                <li>
                    {formatString(strings.deviceReady, this.props.deviceReady)}
                </li> : null}
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
        if (this.props.deviceReady) {
            e.preventDefault();
            cordova.InAppBrowser.open(
                e.currentTarget.href, "_blank", "location=yes");
        }
    }
}
