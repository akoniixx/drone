import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

import AsyncStorage from '@react-native-async-storage/async-storage';

const credentials = {
  databaseURL: '',
  clientId:
    '624587099660-g11b50kio2iiuepcn5lv9ciu1uroa9bi.apps.googleusercontent.com',
  appId: '1:624587099660:ios:5947d5a2e249610d40e829',
  apiKey: 'AIzaSyDVnYdTOLWIoN4HpwDTnhZddEePlDDQ96M',
  storageBucket: 'droner-app.appspot.com',
  messagingSenderId: '624587099660',
  projectId: 'droner-app',
};

export const firebaseInitialize = async () => {
  if (!firebase.apps.length) {
    await firebase.initializeApp(credentials);
  } else {
    firebase.app();
  }
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    setTimeout(() => {
      getFCMToken();
    }, 1000);
  }
}

export const getFCMToken = async () => {
  try {
    const localFcmToken = await AsyncStorage.getItem('fcmToken');
    if (localFcmToken) {
      return;
    }
    const token = await messaging().getToken();
    await AsyncStorage.setItem('fcmtoken', token);
    console.log(token);
    messaging().setBackgroundMessageHandler(async remote => {});
  } catch (err) {
    console.log(err);
  }
};

export const fcmOnListen = () => {
  messaging().onMessage(async remoteMessage => {
    // page.current = remoteMessage.notification.body;
  });
};
