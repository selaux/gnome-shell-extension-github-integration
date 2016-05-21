import Promise from 'bluebird';

import startApp from './app/app';
import getHttpSession from './lib/getHttpSession';
import getSettings from './lib/getSettings';

const mainPanel = imports.ui.main.panel;
const PanelMenu = imports.ui.panelMenu;
const mainLoop = imports.mainloop;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;

function setTimeout(fn, ms){
    mainLoop.timeout_add(ms, fn);
}

Promise.setScheduler((fn) => setTimeout(fn, 1));

let context;
let ui;

function init() {
    const settings = getSettings(imports, Me);
    const httpSession = getHttpSession(imports, settings);
    const panelButton = new PanelMenu.Button(0.0, "Github Indicator", false);
    const indicator = new St.Label({ text: '', y_expand: true, y_align: Clutter.ActorAlign.CENTER });

    panelButton.actor.add_actor(indicator);

    context = {
        settings,
        httpSession,
        setTimeout
    };
    ui = {
        panelButton,
        indicator
    };
}

function enable() {
    startApp(context, ui);

    mainPanel.addToStatusArea('github-indicator', ui.panelButton);
}

function disable() {}

global.extension = { init: init, enable: enable, disable: disable() };
