const githubNotificationUrl = 'https://api.github.com/notifications';

export const REQUEST_NOTIFICATIONS = 'REQUEST_NOTIFICATIONS';
function request() {
    return {
        type: REQUEST_NOTIFICATIONS
    };
}

export const RECEIVE_NOTIFICATIONS = 'RECEIVE_NOTIFICATIONS';
export function receive(notifications) {
    return {
        type: RECEIVE_NOTIFICATIONS,
        notifications: notifications
    };
}

export const ERROR_NOTIFICATIONS = 'ERROR_NOTIFICATIONS';
export function error(error) {
    return {
        type: ERROR_NOTIFICATIONS,
        error: error
    };
}

export function updateNotifications(context, dispatch) {
    dispatch(request());

    return context.httpSession.get(githubNotificationUrl).then(function (notifications) {
        dispatch(receive(notifications));
    }).catch(function (err) {
        dispatch(error(err.message));
    });
}
