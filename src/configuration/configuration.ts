/**
 * This file is derived from VSCodeVim/Vim.
 */

// tslint:disable: object-literal-sort-keys

import * as vscode from "vscode";
import { IConfiguration, IDebugConfiguration } from "./iconfiguration";

export class Configuration implements IConfiguration, vscode.Disposable {
    /**
     * Configuration uses singleton pattern.
     */
    public static get instance(): Configuration {
        return this.inst;
    }

    public static initialize(context: vscode.ExtensionContext) {
        if (this.inst) {
            return;
        }

        this.inst = new Configuration();
        context.subscriptions.push(this.inst);
    }

    private static inst: Configuration;

    /**
     * Config fields
     */

    public killRingMax = 60;

    public debug: IDebugConfiguration = {
        silent: false,
        loggingLevelForAlert: "error",
        loggingLevelForConsole: "error",
    };

    /**
     * Instance methods
     */

    private constructor() {
        this.reload();
    }

    public dispose() {
        // Now nothing to be done.
    }

    private reload() {
        const emacsConfigs = vscode.workspace.getConfiguration("emacs-mcx");

        /* tslint:disable:forin */
        // Disable forin rule here as we make accessors enumerable.`
        for (const option in this) {
            let val = emacsConfigs[option] as any;
            if (val !== null && val !== undefined) {
                if (val.constructor.name === Object.name) {
                    val = Configuration.unproxify(val);
                }
                this[option] = val;
            }
        }
    }

    // tslint:disable-next-line: member-ordering
    private static unproxify(obj: {[key: string]: any}) {
        const result: {[key: string]: any} = {};
        for (const key in obj) {
            const val = obj[key] as any;
            if (val !== null && val !== undefined) {
                result[key] = val;
            }
        }
        return result;
    }
}
