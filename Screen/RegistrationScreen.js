import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {Picker} from '@react-native-picker/picker';

import {useFocusEffect} from '@react-navigation/native';

import TcpSocket from 'react-native-tcp-socket';

const RegistrationScreen = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [url1, seturl] = useState('');
  const [contact, setcontact] = useState('');
  const [userEmail, setuserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [application, setApplication] = useState('');
  const [event, setEvent] = useState('');

  const passwordInputRef = createRef();

  const handleSubmitPress = () => {
    if (!userName) {
      alert('Please fill Name');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    if (!application) {
      alert('Please fill Application');
      return;
    }

    let dataToSend = JSON.stringify({
      credentials: {
        UserName: userName,
        Password: userPassword,
        Application: application,
        Type: 'Both',
        Action: 'Registration',
        Emailid: userEmail,
        PNo: contact,
        Url: url1,
      },
    });
    console.log(
      '----------------------------------------------------------------',
    );
    console.log('data passed to webservice==>', dataToSend);
    let url = 'https://livefiles.sowcare.net/api/auth?pubsubId=0';
    retrieveData();
    async function retrieveData() {
      const read = await AsyncStorage.getItem('registration');
      let parse = JSON.parse(read);
      webservice(parse);
    }

    function webservice(parse) {
      fetch('https://livefiles.sowcare.net/api/AddelUser', {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: 'bearer' + '83l626XhHk',
          'Content-Type': 'application/json',
        },
        body: dataToSend,
      })
        .then(response => response.json())
        .then(data => {
          console.log('response from webservice ===>', data);
          console.log('status ===>', data.Status);
          if (data.Status == 'Subscription Successsfull') {
            let client = TcpSocket.createConnection(
              {port: 9000, host: 'localhost'},
              () => {
                client.write(
                  JSON.stringify({
                    Name: data.Name,
                    Pub_Sub_Id: data.Pub_Sub_Id,
                    Application_Name: data.Application_Name,
                    Email_Id: data.Email_Id,
                    Phone_Number: data.Phone_Number,
                    Url: data.Url,
                    application: parse.application,
                    key: parse.key,
                    // old query `INSERT INTO user_registration(Name,Pub_Sub_Id,Application_Name,Email_Id,Phone_Number,Url)
                    //   SELECT ?,?,?,?,?,? ON CONFLICT(Pub_Sub_Id) DO UPDATE SET Name = EXCLUDED.Name,
                    //   Email_Id = EXCLUDED.Email_Id,Phone_Number=EXCLUDED.Phone_Number,Url=EXCLUDED.Url;`

                    query2: `INSERT INTO user_registration(Name,Pub_Sub_Id,Application_Name,Email_Id,Phone_Number,Url) 
                      SELECT ?,?,?,?,?,?  WHERE EXISTS (SELECT 1 FROM client_registration WHERE Application= ? AND key = ?)
                      ON CONFLICT(Pub_Sub_Id) DO UPDATE SET Name = EXCLUDED.Name, 
                      Email_Id = EXCLUDED.Email_Id,Phone_Number=EXCLUDED.Phone_Number,Url=EXCLUDED.Url;`,
                  }),
                );
              },
            );

            client.on('data', data => {
              console.log(
                'message from user_registration table==>',
                data.toString(),
              );
              Alert.alert('Subscription Successsfull');
              client.end();
            });
            client.on('error', error => {
              console.log(error);
              client.end();
            });
            client.on('close', () => {
              console.log('Connection closed!');
              client.end();
            });
            Alert.alert('Subscription Successsfull');
          } else if (data.Status == 'User has already Subscribed') {
            let client = TcpSocket.createConnection(
              {port: 9000, host: 'localhost'},
              () => {
                client.write(
                  JSON.stringify({
                    Name: data.Name,
                    Pub_Sub_Id: data.Pub_Sub_Id,
                    Application_Name: data.Application_Name,
                    Email_Id: data.Email_Id,
                    Phone_Number: data.Phone_Number,
                    Url: data.Url,
                    application: parse.application,
                    key: parse.key,
                    query2: `INSERT INTO user_registration(Name,Pub_Sub_Id,Application_Name,Email_Id,Phone_Number,Url) 
                      SELECT ?,?,?,?,?,?  WHERE EXISTS (SELECT 1 FROM client_registration WHERE Application= ? AND key = ?)
                      ON CONFLICT(Pub_Sub_Id) DO UPDATE SET Name = EXCLUDED.Name, 
                      Email_Id = EXCLUDED.Email_Id,Phone_Number=EXCLUDED.Phone_Number,Url=EXCLUDED.Url;`,
                    // query2:
                    //   'INSERT INTO user_registration(Name,Pub_Sub_Id,Application_Name,Email_Id,Phone_Number,Url) VALUES (?,?,?,?,?,?) ON CONFLICT(Pub_Sub_Id) DO UPDATE SET Name = EXCLUDED.Name, Email_Id = EXCLUDED.Email_Id,Phone_Number=EXCLUDED.Phone_Number,Url=EXCLUDED.Url;',
                  }),
                );
              },
            );

            client.on('data', data => {
              console.log(
                'message from user_registration table ==>',
                data.toString(),
              );
              Alert.alert('User is already subscribed');
              client.end();
            });
            client.on('error', error => {
              console.log(error);
              client.end();
            });
            client.on('close', () => {
              console.log('Connection closed!');
              client.end();
            });
          } else if (data.Status == 'Invalid Credentials!!!!') {
            Alert.alert('Invalid Credentials!!!!');
          } else if (data.Status == 'Incorrect Credentials') {
            Alert.alert('Incorrect Credentials');
          }
        })
        .catch(error => {
          console.error('error in webservice====>', error);
        });
    }
  };

  return (
    <View style={styles.mainBody}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={styles.SectionStyle}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={userName => setUserName(userName)}
            placeholder="Enter Name"
            placeholderTextColor="white"
            autoCapitalize="none"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.SectionStyle}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={UserPassword => setUserPassword(UserPassword)}
            placeholder="Enter Password" //12345
            placeholderTextColor="white"
            keyboardType="default"
            ref={passwordInputRef}
            onSubmitEditing={Keyboard.dismiss}
            blurOnSubmit={false}
            secureTextEntry={true}
            underlineColorAndroid="#f000"
            returnKeyType="next"
          />
        </View>
        <View style={styles.SectionStyle}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={application => setApplication(application)}
            placeholder="Enter Application" //12345
            placeholderTextColor="white"
            keyboardType="default"
            onSubmitEditing={Keyboard.dismiss}
            underlineColorAndroid="#f000"
            returnKeyType="next"
          />
        </View>
        {/* <View style={styles.SectionStyle}>
          <Picker
            style={styles.inputStyle}
            selectedValue={selectedAction}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedAction(itemValue)
            }>
            <Picker.Item label="Choose Action" />
            <Picker.Item label="Registration" value="Registration" />
            <Picker.Item label="Deregistration" value="DeRegistration" />
          </Picker>
        </View> */}
        <View style={styles.SectionStyle}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={url => seturl(url)}
            placeholder="enter url"
            placeholderTextColor="white"
            autoCapitalize="none"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.SectionStyle}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={contact => setcontact(contact)}
            placeholder="Enter contact Number"
            placeholderTextColor="white"
            autoCapitalize="none"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.SectionStyle}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={userEmail => setuserEmail(userEmail)}
            placeholder="Enter user Email"
            placeholderTextColor="white"
            autoCapitalize="none"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={handleSubmitPress}>
          <Text style={styles.buttonTextStyle}> Register User</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
export default RegistrationScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#307ecc',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#307e',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE2',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  picker: {
    width: 300,
    height: 45,
    color: 'white',
    backgroundColor: 'blue',
    alignSelf: 'center',
    textAlign: 'center',
  },
});
