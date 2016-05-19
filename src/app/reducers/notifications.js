import { REQUEST_NOTIFICATIONS, RECEIVE_NOTIFICATIONS, ERROR_NOTIFICATIONS } from '../actions/notifications';
import R from 'ramda';

export default function notifications(state, action) {
  switch (action.type) {
    case REQUEST_NOTIFICATIONS:
      return R.merge(state, { fetching: true });
    case RECEIVE_NOTIFICATIONS:
      return R.merge(state, { fetching: false, notifications: action.notifications });
    case ERROR_NOTIFICATIONS:
      return R.merge(state, { fetching: false, error: action.error });
    default:
      return state
  }
}
