import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { Provider as ReduxProvider } from 'react-redux';
import MarketDetails from './screens/MarketDetails';
import Markets from './screens/Markets';
import configureStore from './store/configureStore';

const AppNavigator = createStackNavigator({
  Markets: {
    screen: Markets,
  },
  MarketDetails: {
    screen: MarketDetails,
  },
});

const AppContainer = createAppContainer(AppNavigator);

const store = configureStore();

export default function App() {
  return (
    <ReduxProvider store={store}>
      <AppContainer />
    </ReduxProvider>
  );
}
