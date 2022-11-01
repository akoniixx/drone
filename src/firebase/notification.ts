import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const credentials = {
    databaseURL: '',
    clientId: '624587099660-g11b50kio2iiuepcn5lv9ciu1uroa9bi.apps.googleusercontent.com',
    appId: (Platform.OS === 'ios')?'1:624587099660:ios:5947d5a2e249610d40e829':'1:624587099660:android:7195a4bc311d807940e829',
    apiKey: 'AIzaSyDVnYdTOLWIoN4HpwDTnhZddEePlDDQ96M',
    storageBucket: 'droner-app.appspot.com',
    messagingSenderId: '624587099660',
    projectId: 'droner-app',
  };

export const firebaseInitialize = async() =>{
  await firebase.initializeApp(credentials)
}

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      // console.log('Authorization status:', authStatus);
    }
  }
  
  export const getFCMToken = async() =>{
      const token = await messaging().getToken();
      await AsyncStorage.setItem('fcmtoken',token);
  }
  
  export const fcmOnListen = ()=>{
  
      messaging().onMessage(async remoteMessage => {
          // page.current = remoteMessage.notification.body;
      });
  }
  