const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;

const Gettext = imports.gettext.domain('gnome-shell-extensions-mediaplayer');
const _ = Gettext.gettext;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;

let gsettings;
let settings;
let settings_indicator;

function init() {
    gsettings = Settings.getSettings(Me);
    settings = {
        user: {
            type: "s",
            label: _("User"),
            help: _("Your Github Username")
        },
        api_key: {
            type: "s",
            label: _("API Key"),
            help: _("The api key created for you by GitHub")
        },
        update_interval: {
            type: "i",
            label: _("Update Interval"),
            help: _("Seconds between updates from the GitHub API."),
            min: 1
        }
    };
}

function buildPrefsWidget() {
    let frame = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL,
                             border_width: 10});
    let vbox = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL,
                            margin: 20, margin_top: 10 });
    let hbox;

    for (let setting in settings) {
        hbox = buildHbox(settings, setting);
        vbox.add(hbox);
    }

    frame.add(vbox);
    frame.show_all();

    return frame;
}

function buildHbox(settings, setting) {
    let hbox;

    if (settings[setting].type == 's')
        hbox = createStringSetting(settings, setting);
    if (settings[setting].type == "i")
        hbox = createIntSetting(settings, setting);

    return hbox;
}

function createStringSetting(settings, setting) {

    let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL,
                            margin_top: 5});

    let setting_label = new Gtk.Label({label: settings[setting].label,
                                       xalign: 0 });

    let setting_string = new Gtk.Entry({text: gsettings.get_string(setting.replace('_', '-'))});
    setting_string.set_width_chars(30);
    setting_string.connect('notify::text', function(entry) {
        gsettings.set_string(setting.replace('_', '-'), entry.text);
    });

    if (settings[setting].mode == "passwd") {
        setting_string.set_visibility(false);
    }

    if (settings[setting].help) {
        setting_label.set_tooltip_text(settings[setting].help);
        setting_string.set_tooltip_text(settings[setting].help);
    }

    hbox.pack_start(setting_label, true, true, 0);
    hbox.add(setting_string);

    return hbox;
}

function createIntSetting(settings, setting) {

    let hbox = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL,
                            margin_top: 5});

    let setting_label = new Gtk.Label({label: settings[setting].label,
                                       xalign: 0 });

    let adjustment = new Gtk.Adjustment({ lower: 1, upper: 65535, step_increment: 1});
    let setting_int = new Gtk.SpinButton({adjustment: adjustment,
                                          snap_to_ticks: true});
    setting_int.set_value(gsettings.get_int(setting.replace('_', '-')));
    setting_int.connect('value-changed', function(entry) {
        gsettings.set_int(setting.replace('_', '-'), entry.value);
    });

    if (settings[setting].help) {
        setting_label.set_tooltip_text(settings[setting].help);
        setting_int.set_tooltip_text(settings[setting].help);
    }

    hbox.pack_start(setting_label, true, true, 0);
    hbox.add(setting_int);

    return hbox;
}
