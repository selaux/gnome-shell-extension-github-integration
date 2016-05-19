import R from 'ramda';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { updateNotifications } from './actions/notifications';
import notifications from './reducers/notifications';

function fetchInfinite(context, rootStore) {
    rootStore.dispatch(R.partial(updateNotifications, [ context ])).then(function () {
        context.setTimeout(R.partial(fetchInfinite, [ context, rootStore ]), 60000);
    });
}

export default function start(context) {
    const initialState = {
        fetching: false,
        error: null,
        notifications: []
    };
    const rootStore = createStore(notifications, initialState, applyMiddleware(thunk));

    rootStore.subscribe(() => global.log(JSON.stringify(rootStore.getState())));

    fetchInfinite(context, rootStore);
}

