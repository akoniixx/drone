import React, {createContext, useEffect, useMemo, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import PinScreen from '../screens/PinScreen/PinScreen';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
import MainTapNavigator from './bottomTabs/MainTapNavigator';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen.tsx/TaskDetailScreen';

import ProfileDocument from '../screens/ProfileScreen/ProfileDocument';
import FourthFormScreen from '../screens/RegisterScreen/FourthFormScreen';
import AddIDcardScreen from '../screens/RegisterScreen/AddIDcardScreen';
import ViewProfile from '../screens/ProfileScreen/ViewProfile';
import EditProfile from '../screens/ProfileScreen/EditProfile';
import DeleteProfile from '../screens/ProfileScreen/DeleteProfile';
import VerifyOTP from '../screens/ProfileScreen/DeleteProfile/VerifyOTP';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationHelpers} from '@react-navigation/stack/lib/typescript/src/types';
import NotificationList from '../screens/ProfileScreen/NotificationList';
import UploadBankingScreen from '../screens/ProfileScreen/UploadDocument/UploadBankingScreen';
import UploadDronerLicenseScreen from '../screens/ProfileScreen/UploadDocument/UploadDronerLicenseScreen';
import ServiceArea from '../screens/ProfileScreen/ServiceArea';
import { MaintenanceSystem, MaintenanceSystem_INIT } from '../entities/MaintenanceEntities';
import { SystemMaintenance } from '../datasource/MaintenanceDatasource';
// import DeleteSuccess from '../screens/ProfileScreen/DeleteProfile/DeleteSuccess';

export type StackParamList = {
  DeleteProfileScreen: {
    navigation: StackNavigationHelpers;
    route: RouteProp<{params: {id: string}}, 'params'>;
  };
  VerifyOTP: any;
  MainScreen: any;
  ProfileScreen: any;
  TaskDetailScreen: any;
  EditProfile: any;
  ViewProfile: any;
  ProfileDocument: any;
  FourthFormScreen: any;
  AddIDCardScreen: any;
  NotificationList: any;
  UploadDronerLicenseScreen: any;
  UploadBankingScreen:any;
  ServiceArea : any;
  // DeleteSuccess: {
  //   navigation: StackNavigationHelpers;
  // };
};
export type StackNativeScreenProps<T extends keyof StackParamList> =
  NativeStackScreenProps<StackParamList, T>;
const Stack = createStackNavigator<StackParamList>();

const MainNavigator: React.FC = () => {

  const [reload, setReload] = useState(false);
  const [end, setEnd] = useState<any>();
  const [start, setStart] = useState<any>();
  const [maintenanceApp, setMaintenanceApp] = useState<MaintenanceSystem>(
    MaintenanceSystem_INIT,
  );

  const Maintenance = async () => {
    await SystemMaintenance.Maintenance('DRONER')
      .then(res => {
        setMaintenanceApp(res.responseData);
        setReload(!reload);
      })
      .catch(err => console.log(err));
    if (maintenanceApp != null) {
      setStart(Date.parse(maintenanceApp.dateStart));
      setEnd(Date.parse(maintenanceApp.dateEnd));
    }
  };

   useEffect(() => {
    Maintenance();
  }, [reload]);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="MainScreen"
        component={MainTapNavigator}
        options={{
          gestureEnabled: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="TaskDetailScreen" component={TaskDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ViewProfile" component={ViewProfile} />
      <Stack.Screen name="ProfileDocument" component={ProfileDocument} />
      <Stack.Screen name="FourthFormScreen" component={FourthFormScreen} />
      <Stack.Screen name="AddIDCardScreen" component={AddIDcardScreen} />
      <Stack.Screen name="DeleteProfileScreen" component={DeleteProfile} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
      <Stack.Screen name="NotificationList" component={NotificationList} />
      <Stack.Screen name="UploadDronerLicenseScreen" component={UploadDronerLicenseScreen} />
      <Stack.Screen name="UploadBankingScreen" component={UploadBankingScreen} />
      <Stack.Screen name="ServiceArea" component={ServiceArea} />
      {/* <Stack.Screen name="DeleteSuccess" component={DeleteSuccess} /> */}
    </Stack.Navigator>
  );
};

export default MainNavigator;
