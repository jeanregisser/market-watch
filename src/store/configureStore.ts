import { applyMiddleware, compose, createStore } from 'redux';
import { queryMiddleware } from 'redux-query';
import rootReducer from '../reducers';

export default function configureStore() {
  const preloadedState = undefined;

  const middlewares = [
    queryMiddleware(
      (state: any) => state.queries,
      (state: any) => state.entities,
    ),
  ];

  if (__DEV__) {
    const { logger } = require(`redux-logger`);
    middlewares.push(logger);
  }

  // @ts-ignore
  const win: any = window;
  const composeEnhancers =
    typeof win === 'object' && win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
      : compose;

  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  return createStore(rootReducer, preloadedState, enhancer);
}
