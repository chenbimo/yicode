import * as vscode from 'vscode';

const typeScriptExtensionId = 'vscode.typescript-language-features';
const pluginId = 'typescript-lit-html-plugin';
const configurationSection = 'lit-html';

export async function activate(context) {
    const extension = vscode.extensions.getExtension(typeScriptExtensionId);

    if (!extension) {
        return;
    }

    await extension.activate();

    if (!extension.exports || !extension.exports.getAPI) {
        return;
    }

    const api = extension.exports.getAPI(0);

    if (!api) {
        return;
    }

    vscode.workspace.onDidChangeConfiguration(
        (e) => {
            if (e.affectsConfiguration(configurationSection)) {
                synchronizeConfiguration(api);
            }
        },
        undefined,
        context.subscriptions
    );

    synchronizeConfiguration(api);
}

function synchronizeConfiguration(api) {
    api.configurePlugin(pluginId, getConfiguration());
}

function getConfiguration() {
    const config = vscode.workspace.getConfiguration(configurationSection);
    const outConfig = {
        format: {}
    };

    withConfigValue(config, 'tags', (tags) => {
        outConfig.tags = tags;
    });
    withConfigValue(config, 'format.enabled', (enabled) => {
        outConfig.format.enabled = enabled;
    });

    return outConfig;
}

function withConfigValue(config, key, withValue) {
    const configSetting = config.inspect(key);

    if (!configSetting) {
        return;
    }

    // Make sure the user has actually set the value.
    // VS Code will return the default values instead of `undefined`, even if user has not don't set anything.
    if (
        //
        typeof configSetting.globalValue === 'undefined' &&
        typeof configSetting.workspaceFolderValue === 'undefined' &&
        typeof configSetting.workspaceValue === 'undefined'
    ) {
        return;
    }

    const value = config.get(key, undefined);

    if (typeof value !== 'undefined') {
        withValue(value);
    }
}

export function deactivate() {}
