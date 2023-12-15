import React, {useCallback} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

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
import DetailGuruScreen from '../screens/NewsScreen/DetailGuruScreen';
import IncomeScreen from '../screens/IncomeScreen';
import MyRewardScreen from '../screens/MyRewardScreen';
import RewardDetailScreen from '../screens/RewardDetailScreen';
import RedeemAddressScreen from '../screens/RedeemAddressScreen';
import CustomAddressScreen from '../screens/CustomAddressScreen';
import PointHistoryScreen from '../screens/PointScreen/PointHistoryScreen';
import RedeemScreen from '../screens/RedeemScreen';
import CampaignScreen from '../screens/CampaignScreen/CampaignScreen';
import RedeemDetailScreen from '../screens/RedeemDetailScreen';
import MissionDetailScreen from '../screens/MissionDetailScreen';
import WinnerCampaignScreen from '../screens/CampaignScreen/WinnerCampaignScreen';
import RulesCampaignScreen from '../screens/CampaignScreen/RulesCampaignScreen';
import DateCampaignScreen from '../screens/CampaignScreen/DateCampaign';
import {DigitalRewardType} from '../types/TypeRewardDigital';
import RedeemDetailDigitalScreen from '../screens/RedeemDetailDigitalScreen';
import MyProfileScreen from '../screens/ProfileVerifyScreen/MyProfileScreen';
import IDCardScreen from '../screens/ProfileVerifyScreen/IDCardScreen';
import AddDroneScreen from '../screens/ProfileVerifyScreen/AddDroneScreen';
import AddPlantsScreen from '../screens/ProfileVerifyScreen/AddPlantsScreen';
import CameraScreen from '../screens/CameraScreen';
import AdditionDocumentScreen from '../screens/AdditionDocumentScreen';
import NewAddIDCardScreen from '../screens/NewAddIDCardScreen';
import DroneListScreen from '../screens/DroneListScreen';
import NewsScreen from '../screens/NewsScreen/AllScreen';
import GuruScreen from '../screens/GuruScreen';
import MissionScreen from '../screens/MissionScreen';
import GuruDetailScreen from '../screens/GuruDetailScreen';
import FinishTaskScreen from '../screens/FinishTaskScreen';
import AllFarmerListScreen from '../screens/AllFarmerListScreen';
import SelectFarmerScreen from '../screens/SelectFarmerScreen';
import CreateTaskScreen from '../screens/CreateTaskScreen';

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
  UploadBankingScreen: {
    bookBank: any;
    profile: any;
  };
  ServiceArea: any;
  NewsScreen: any;
  DetailGuruScreen: any;
  PointHistoryScreen: any;

  IncomeScreen: undefined;
  HistoryRewardScreen: undefined;
  MyRewardScreen: undefined;

  WinnerCampaignScreen: any;
  RulesCampaignScreen: any;
  DateCampaignScreen: any;

  RewardDetailScreen: {
    navigation: StackNavigationHelpers;
    id: string;
    isDigital?: boolean;
  };
  RedeemAddressScreen: {
    data: any;
    missionData: any;
  };
  CustomAddressScreen: {
    data: any;
    isEdit?: boolean;
    initialValues?: any;
  };
  RedeemScreen: {
    data: DigitalRewardType;
    imagePath: string;
    expiredUsedDate: string;
  };
  CampaignScreen: any;
  RedeemDetailScreen: {
    id: string;
    isFromMissionDetail: true;
  };
  RedeemDetailDigitalScreen: {
    id: string;
    isFromHistory: boolean;
  };
  MissionDetailScreen: {
    data: {
      current: number;
      isComplete: boolean;
      isExpired: boolean;
      isStatusComplete: boolean;
      reward: any;
      endDate: string;
      total: number;
      missionName: string;
      conditionReward: string;
      descriptionReward: string;
      num: number;
      missionId: string;
      status: string;
      isMissionPoint: boolean;
      missionPointDetail: {
        num: number;
        rai: number;
        point: number;
        conditionReward: string;
        descriptionReward: string;
        allRai: number;
        status: string;
      };
    };
  };
  MyProfileScreen: any;
  IDCardScreen: any;
  AddPlantsScreen: any;
  AddDroneScreen: any;
  CameraScreen: any;
  AdditionDocumentScreen: any;
  NewAddIDCardScreen: any;
  AddBookBankScreen: any;
  DroneListScreen: undefined;
  GuruScreen: undefined;
  GuruDetailScreen: {
    guruId: string;
  };
  MissionScreen: undefined;
  FinishTaskScreen: {
    taskId: string;
    taskAppointment: string;
    isFromTaskDetail: boolean;
  };
  SelectFarmerScreen: undefined;
  AllFarmerListScreen: undefined;
  CreateTaskScreen: {
    farmerId: string;
  };

  // DeleteSuccess: {
  //   navigation: StackNavigationHelpers;
  // };
};

export type StackNativeScreenProps<T extends keyof StackParamList> =
  NativeStackScreenProps<StackParamList, T>;
const Stack = createStackNavigator<StackParamList>();

const MainNavigator: React.FC<any> = () => {
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
      <Stack.Screen
        name="UploadDronerLicenseScreen"
        component={UploadDronerLicenseScreen}
      />
      <Stack.Screen
        name="UploadBankingScreen"
        component={UploadBankingScreen}
      />
      <Stack.Screen name="ServiceArea" component={ServiceArea} />
      <Stack.Screen name="NewsScreen" component={NewsScreen} />
      <Stack.Screen name="PointHistoryScreen" component={PointHistoryScreen} />

      <Stack.Screen name="DetailGuruScreen" component={DetailGuruScreen} />
      <Stack.Screen name="IncomeScreen" component={IncomeScreen} />

      <Stack.Screen name="MyRewardScreen" component={MyRewardScreen} />
      <Stack.Screen name="RewardDetailScreen" component={RewardDetailScreen} />
      <Stack.Screen
        name="RedeemAddressScreen"
        component={RedeemAddressScreen}
      />
      <Stack.Screen
        name="CustomAddressScreen"
        component={CustomAddressScreen}
      />
      <Stack.Screen name="RedeemScreen" component={RedeemScreen} />
      <Stack.Group
        screenOptions={{
          gestureEnabled: false,
        }}>
        <Stack.Screen
          name="RedeemDetailScreen"
          component={RedeemDetailScreen}
        />
        <Stack.Screen
          name="RedeemDetailDigitalScreen"
          component={RedeemDetailDigitalScreen}
        />
      </Stack.Group>
      <Stack.Screen
        name="MissionDetailScreen"
        component={MissionDetailScreen}
      />
      {/* <Stack.Screen name="DeleteSuccess" component={DeleteSuccess} /> */}
      <Stack.Screen name="CampaignScreen" component={CampaignScreen} />
      <Stack.Screen
        name="WinnerCampaignScreen"
        component={WinnerCampaignScreen}
      />
      <Stack.Screen
        name="RulesCampaignScreen"
        component={RulesCampaignScreen}
      />
      <Stack.Screen name="DateCampaignScreen" component={DateCampaignScreen} />
      <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
      <Stack.Screen name="IDCardScreen" component={IDCardScreen} />
      <Stack.Screen name="AddDroneScreen" component={AddDroneScreen} />
      <Stack.Screen name="AddPlantsScreen" component={AddPlantsScreen} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen
        name="AdditionDocumentScreen"
        component={AdditionDocumentScreen}
      />
      <Stack.Screen name="NewAddIDCardScreen" component={NewAddIDCardScreen} />
      <Stack.Screen name="DroneListScreen" component={DroneListScreen} />
      <Stack.Group>
        <Stack.Screen name="GuruScreen" component={GuruScreen} />
        <Stack.Screen
          name="GuruDetailScreen"
          component={GuruDetailScreen}
          initialParams={{
            guruId: '',
          }}
        />
        <Stack.Screen name="MissionScreen" component={MissionScreen} />
      </Stack.Group>
      <Stack.Screen
        name="FinishTaskScreen"
        component={FinishTaskScreen}
        initialParams={{
          taskId: '',
          taskAppointment: '',
          isFromTaskDetail: false,
        }}
      />
      <Stack.Group>
        <Stack.Screen
          name="SelectFarmerScreen"
          component={SelectFarmerScreen}
        />
        <Stack.Screen
          name="AllFarmerListScreen"
          component={AllFarmerListScreen}
        />
        <Stack.Screen name="CreateTaskScreen" component={CreateTaskScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainNavigator;
