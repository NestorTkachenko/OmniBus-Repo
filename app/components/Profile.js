import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, } from 'react-native';
import { StackNavigator } from 'react-navigation';


export default class Login extends React.Component {
  

  render() {
    return (

        <View style = {styles.container}>

          <Text style = {styles.header}>Member Page</Text>

        </View>

    );
  }


}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#2896d3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 40,
    paddingRight: 40,
  },
  header: {
    fontSize: 24,
    marginBottom: 60,
    color: '#fff',
    fontWeight: 'bold', 
  },

});
