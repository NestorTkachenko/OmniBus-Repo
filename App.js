import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Login from './app/components/Login';

const Application = createStackNavigator(
  {
    Home: {screen: Login},
  },

  {
    navigationOptions: {
      header: null,
    },
  },);

export default class App extends React.Component {
  render() {
    return (
      <Application />
    );
  }
}