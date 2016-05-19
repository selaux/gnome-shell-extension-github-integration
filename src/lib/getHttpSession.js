import R from 'ramda';
import Promise from 'bluebird';

const userAgent = 'selaux/gnome-github-integration';

function getFromGithub(imports, session, auth, url) {
    const request = imports.gi.Soup.Message.new('GET', url);

    request.request_headers.append("Authorization",auth.get_authorization(request));
    request.request_headers.append("User-Agent", userAgent);

    return new Promise((resolve, reject) => {
        session.queue_message(request, (session, response) => {
            if (response.status_code !== 200) {
                reject(new Error('Failed with status code: ' + response.status_code));
            } else {
                resolve(JSON.parse(response.response_body.data));
            }
        });
    });
}

export default function getHttpSession(imports, settings) {
    const httpSession = new imports.gi.Soup.SessionAsync();
    const auth = new imports.gi.Soup.AuthBasic();

    auth.authenticate(settings.get_string('user'), settings.get_string('api-key'));
    imports.gi.Soup.Session.prototype.add_feature.call(httpSession, new  imports.gi.Soup.ProxyResolverDefault());

    return { get: R.partial(getFromGithub, [  imports, httpSession, auth ]) };
}
