/// <reference types="cordova" />
/// <reference types="cordova-plugin-inappbrowser" />

declare global {
    interface Cordova {
        InAppBrowser: InAppBrowser;
    }
}

import * as React from "react";
import strings from "./strings";
import store, { isDeviceReady } from "./store";

const pageStyles = require<any>("./Page.less");

interface ISettinsState {
    readonly deviceReady: boolean;
}

export default class Settings extends React.Component<{}, ISettinsState> {

    unsubscribe: () => void;

    componentWillMount() {
        this.setState(this.getState());
        this.unsubscribe = store.subscribe(this.setState.bind(this));
    }

    getState() {
        return {
            ...this.state || {},
            deviceReady: store.getState().deviceReady
        };
    }

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
                    {formatString(strings.deviceReady, isDeviceReady())}
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
        if (store.getState().deviceReady) {
            e.preventDefault();
            cordova.InAppBrowser.open(
                e.currentTarget.href, "_blank", "location=yes");
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

}

function formatString (template: string, ...args: any[]): string {
    return args.reduce(
        (prev, value, i) => prev.replace(`{${i}}`, getValue(value)),
        template);
}

function getValue (value: string | boolean): string {
    if (typeof value === "boolean") {
        return strings[value ? "yes" : "no"];
    }
    return value;
}
