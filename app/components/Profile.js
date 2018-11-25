import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, Modal, TouchableHighlight, Alert, TouchableWithoutFeedback} from 'react-native';
import { StackNavigator } from 'react-navigation';
import {API, graphqlOperation} from 'aws-amplify';
import * as mutations from '../../src/graphql/mutations';
import * as subscriptions from '../../src/graphql/subscriptions';
import { MapView } from 'expo';


const query = `
  query {
    listUsers{
      items{
        id name location
      }
    }
}
`




export default class Profile extends React.Component {
  

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      newUser: '',
      modalVisible: false,
      }
    }


  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }


  async componentDidMount() {
    const data = await API.graphql(graphqlOperation(query))
    this.setState({
      users: data.data.listUsers.items
    })
    this.interval = setInterval(this.updateMap, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    

    return (
      <View style={
        {
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center'
        }
      }>
      <MapView style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0  }}
        initialRegion={{
          latitude:42.9814,
          longitude:-70.9478,
          latitudeDelta:0.05,
          longitudeDelta:0.05

        }}
        //ref = {(mapView) => { mainMap = mapView; }}
        showsCompass = {false}
        >

        {
          this.state.users.map((user, index) => (
            <MapView.Marker
            coordinate={JSON.parse(user.location)}
            title={user.name}
            description={'Bus'}
            />
            ))
          }

      </MapView>
      
        <View style = {styles.container}>

            <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setModalVisible(false);
            }}>
            <TouchableHighlight onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}
                  style = {{flex: 1}}
                  underlayColor={"transparent"}>
            <View />
            </TouchableHighlight>
              <View style = {styles.outerContainer}>
              <View style = {styles.modalContainer}>
                
                <Text style = {styles.header}>Member Page {"\n"}</Text>

                <TextInput 
                  style = {styles.textInput} 
                  placeholder = 'User Name' 
                  onChangeText = { (newUser) => this.setState({newUser})}
                  underlineColorAndroid = 'transparent'  
                />

                <TouchableOpacity
                  style = {styles.button}
                  onPress = {this.deleteUser}>
                  <Text>Remove User</Text>
                </TouchableOpacity>

                <Text style = {styles.header}>Member Page {"\n"}</Text>

                <TouchableOpacity
                  style = {styles.button}
                  onPress = {this.addUser}>
                  <Text>New User</Text>
                </TouchableOpacity>

                 <TouchableOpacity
                  style = {styles.button}
                  onPress = {this.logout.bind(this)}>
                  <Text>Log Out</Text>
                </TouchableOpacity>
              </View>
              </View>
          </Modal>

           <TouchableOpacity
                style = {styles.button}
                onPress={() => {
                  this.setModalVisible(true);
                }}>
                <Text>Show Modal</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }

  logout() {
      this.props.navigation.navigate('Home');
  };

  updateMap = async() => {
    const data = await API.graphql(graphqlOperation(query))
    this.setState({
      users: data.data.listUsers.items
    })
  }


  addUser = async () => {
      const newTodo = await API.graphql(graphqlOperation(mutations.createUser, {input: {name: this.state.newUser, location: 'coords here'}}));
      const data = await API.graphql(graphqlOperation(query))
      this.setState({
        users: data.data.listUsers.items
      })
  };

  deleteUser = async () => {
      for(var i = 0; i < this.state.users.length; i++) {
        if(this.state.users[i].name == this.state.newUser) {
          await API.graphql(graphqlOperation(mutations.deleteUser, {input: {id: this.state.users[i].id}}));
        }
      }

      const data = await API.graphql(graphqlOperation(query))
      this.setState({
        users: data.data.listUsers.items
      })
  };

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 40,
    paddingRight: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 30,
    borderRadius: 10,
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 60,
    color: 'black',
    fontWeight: 'bold', 
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: '#01c853',
    padding: 20,
    alignItems: 'center',
    borderRadius: 5,
  },
  textInput: {
    alignSelf: 'stretch',
    padding: 16,
    marginBottom: 20,
    backgroundColor: 'grey',
    borderRadius: 10,
  },
  outerContainer: {
    position: "absolute", 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: "center"
  },

});
