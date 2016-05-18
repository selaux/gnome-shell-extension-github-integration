
const Lang = imports.lang;
const Gtk = imports.gi.Gtk;
const Soup = imports.gi.Soup;
const Main = imports.ui.main;
const MessageTray = Main.MessageTray;
const Panel = Main.Panel;
const mainLoop = imports.mainloop;
const ExtensionUtils = imports.misc.extensionUtils;

const Me = ExtensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;

const gsettings = Settings.getSettings(Me);

const githubNotificationUrl = 'https://api.github.com/notifications';
const userAgent = 'selaux/gnome-github-integration'

const notificationSource = new MessageTray.Source('GitHub', 'avatar-default');
const _httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());

const notified = {};
let timeout = null;
let indicator = null;

function init() {
}

function enable() {
  Main.messageTray.add(notificationSource);

  indicator = new Panel.PanelIndicator();
  Main.panel.addToStatusArea('mediaplayer', indicator);

  refresh();
}

function disable() {
  if (indicator) {
    indicator.destroy();
    indicator = null;
  }
}

const GitHubNotification = new Lang.Class({
    Name: 'GitHubNotification',
    Extends: MessageTray.Notification,

    _init: function (source, notificationData) {
      this.parent(source, notificationData.repository.name, notificationData.subject.title);
      this.notificationData = notificationData;

      this.connect('activated', Lang.bind(this, function() {
          const url = notificationData.subject.latest_comment_url

          makeGitHubRequest(url, function (_httpSession, response) {
            if (response.status_code !== 200) {
              return;
            }
            const comment = JSON.parse(response.response_body.data);
            Gtk.show_uri(null, comment.html_url, global.get_current_time());
            this.destroy();
        });
      }));
    },

    destroy: function () {
      delete notified[this.notificationData.id];
      this.parent();
    }
});

function refresh() {
  pollGithubApi();
  if (timeout) {
    mainLoop.source_remove(timeout);
    timeout = null;
  }
  timeout = mainLoop.timeout_add_seconds(gsettings.get_int('update-interval'), refresh);
}

function displayNotification(notificationData) {
  if (typeof notified[notificationData.id] === 'undefined') {
    const notification = new GitHubNotification(notificationSource, notificationData);

    notified[notificationData.id] = notification;

    notificationSource.notify(notification);
  }
}

function removeOutdatedNotifications(validNotificationIds) {
  Object.keys(notified).forEach(function (id) {
    if (validNotificationIds.indexOf(id) === -1) {
      notified[id].destroy();
      delete notified[id];
    }
  });
}

function pollGithubApi() {
  makeGitHubRequest(githubNotificationUrl, function (_httpSession, response) {
    if (response.status_code !== 200) {
      return;
    }

    const notifications = JSON.parse(response.response_body.data);
    const notificationIds = notifications.map((n) => n.id);
    global.log(JSON.stringify(notificationIds, null, 2))

    removeOutdatedNotifications(notificationIds);

    notifications.forEach(displayNotification);
  });
}

function makeGitHubRequest(url, callback) {
  const auth = new Soup.AuthBasic()
  const request = Soup.Message.new('GET', url);

  auth.authenticate(gsettings.get_string('user'), gsettings.get_string('api-key'));

  request.request_headers.append("Authorization",auth.get_authorization(request))
  request.request_headers.append("User-Agent", userAgent);

  _httpSession.queue_message(request, callback);
}
