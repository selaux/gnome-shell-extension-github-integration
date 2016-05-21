import R from 'ramda';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { updateNotifications } from './actions/notifications';
import notifications from './reducers/notifications';
import Indicator from './components/Indicator';

function fetchInfinite(context, rootStore) {
    rootStore.dispatch(R.partial(updateNotifications, [ context ])).then(function () {
        const interval = context.settings.get_int('update-interval');

        context.setTimeout(R.partial(fetchInfinite, [ context, rootStore ]), interval * 1000);
    });
}

export default function start(context, ui) {
    const initialState = {
        fetching: false,
        error: null,
        notifications: []
    };
    const rootStore = createStore(notifications, initialState, applyMiddleware(thunk));

    const indicatorComponent = new Indicator(ui.indicator);
    rootStore.subscribe(() => indicatorComponent.update({ notifications: rootStore.getState().notifications }));

    // rootStore.subscribe(() => global.log(JSON.stringify(rootStore.getState())));

    fetchInfinite(context, rootStore);
}

