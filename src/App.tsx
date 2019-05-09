import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Markets from './screens/Markets';

const AppNavigator = createStackNavigator({
  Markets: {
    screen: Markets,
  },
});

export default createAppContainer(AppNavigator);
