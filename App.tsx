import React, {createContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigations/AppNavigator';
import {navigationRef} from './src/navigations/RootNavigation';
import SplashScreen from 'react-native-splash-screen';
import Toast from 'react-native-toast-message';
import {SheetProvider} from 'react-native-actions-sheet';
import './src/sheet/Sheets';
import {toastConfig} from './src/config/toast-config';
import {ActivityIndicator, BackHandler} from 'react-native';
import buddhaEra from 'dayjs/plugin/buddhistEra';
import dayjs from 'dayjs';
import {AuthProvider} from './src/contexts/AuthContext';
import {Settings} from 'react-native-fbsdk-next';
import {check, request} from 'react-native-permissions';
dayjs.extend(buddhaEra);
import {
  firebaseInitialize,
  requestUserPermission,
} from './src/firebase/notification';
import {Platform} from 'react-native';
import {mixpanel} from './mixpanel';

import {checkNotifications} from 'react-native-permissions';
import 'moment/locale/th';
import './src/components/Sheet';
import {PointProvider} from './src/contexts/PointContext';
import moment from 'moment';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from './src/assets';
import {NetworkProvider} from './src/contexts/NetworkContext';
import {MaintenanceProvider} from './src/contexts/MaintenanceContext';
import {HighlightProvider} from './src/contexts/HighlightContext';

moment.updateLocale('th', {
  relativeTime: {
    future: '%s',
  },
});
type ActionContextType = {
  actiontaskId: string | null;
  setActiontaskId: React.Dispatch<React.SetStateAction<string | null>>;
};

const ActionContextState = {
  actiontaskId: '',
  setActiontaskId: () => {},
};

const ActionContext = createContext<ActionContextType>(ActionContextState);

const App = () => {
  const linking = {
    prefixes: ['dronerapp://'],
  };
  const [actiontaskId, setActiontaskId] = useState<string | null>('');

  const requestTracking = async () => {
    const status = await request('ios.permission.APP_TRACKING_TRANSPARENCY');
    const trackingStatus = await check(
      'ios.permission.APP_TRACKING_TRANSPARENCY',
    );

    if (trackingStatus === 'granted') {
      Settings.setAdvertiserTrackingEnabled(true);
      return;
    }
    if (status === 'granted') {
      Settings.setAdvertiserTrackingEnabled(true);
    } else {
      Settings.setAdvertiserTrackingEnabled(false);
    }
  };

  useEffect(() => {
    const checkPermission = () => {
      checkNotifications().then(async ({status}) => {
        if (status === 'denied' || status === 'blocked') {
          requestUserPermission();
        }
      });
    };

    mixpanel.track('App open');
    BackHandler.addEventListener('hardwareBackPress', () => true);
    SplashScreen.hide();
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token');
      const dronerId = await AsyncStorage.getItem('droner_id');

      console.log('token', token);
      console.log('dronerId', dronerId);
    };
    if (Platform.OS === 'ios') {
      firebaseInitialize();
    }
    requestUserPermission();
    checkPermission();
    getToken();

    // checkVersion();
  }, []);
  useEffect(() => {
    requestTracking();
  }, []);

  return (
    <>
      <NetworkProvider>
        <HighlightProvider>
          <ActionContext.Provider value={{actiontaskId, setActiontaskId}}>
            <NavigationContainer
              ref={navigationRef}
              linking={linking}
              fallback={
                <ActivityIndicator color={colors.orangeSoft} size="large" />
              }>
              <AuthProvider>
                <>
                  <MaintenanceProvider>
                    <PointProvider>
                      <SheetProvider>
                        <AppNavigator />
                      </SheetProvider>
                    </PointProvider>
                  </MaintenanceProvider>
                  <Toast config={toastConfig} />
                </>
              </AuthProvider>
            </NavigationContainer>
          </ActionContext.Provider>
        </HighlightProvider>
      </NetworkProvider>
    </>
  );
};
export {ActionContext};
export default App;
