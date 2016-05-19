import Promise from 'bluebird';

import startApp from './app/app';
import getHttpSession from './lib/getHttpSession';
import getSettings from './lib/getSettings';

const mainLoop = imports.mainloop;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function setTimeout(fn, ms){
    mainLoop.timeout_add(ms, fn);
}

const settings = getSettings(imports, Me);
const httpSession = getHttpSession(imports, settings);
const context = {
    settings,
    httpSession,
    setTimeout
};

Promise.setScheduler((fn) => setTimeout(fn, 1));

startApp(context);

function init() {}
function enable() {}
function disable() {}

global.extension = { init: init, enable: enable, disable: disable() };
