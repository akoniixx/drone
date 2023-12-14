/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from 'react-native';
import {ProfileDatasource} from '../datasource/ProfileDatasource';
import {Authentication} from '../datasource/AuthDatasource';
import {FCMtokenDatasource} from '../datasource/FCMDatasource';
interface Address {
  id: string;
  address1: string;
  address2: string;
  address3: string;
  provinceId: number;
  districtId: number;
  subdistrictId: number;
  postcode: string;
  createdAt: string;
  updatedAt: string;
}

interface DroneBrand {
  id: string;
  name: string;
  logoImagePath: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Drone {
  id: string;
  droneBrandId: string;
  series: string;
  droneBrand: DroneBrand;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DronerDrone {
  id: string;
  dronerId: string;
  droneId: string;
  serialNo: string;
  status: string;
  purchaseYear: string;
  purchaseMonth: string;
  reason: any[];
  drone: Drone;
  file: any[];
  createdAt: string;
  updatedAt: string;
  comment: string;
}

interface DronerArea {
  id: string;
  provinceId: number;
  districtId: number;
  subdistrictId: number;
  lat: string;
  long: string;
  distance: string;
  locationName: string;
  mapUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Droner {
  id: string;
  dronerCode: string;
  firstname: string;
  lastname: string;
  idNo: string;
  telephoneNo: string;
  status: string;
  reason: any[];
  birthDate: string;
  isOpenReceiveTask: boolean;
  expYear: number;
  expMonth: number;
  expPlant: string[];
  address: Address;
  dronerDrone: DronerDrone[];
  dronerArea: DronerArea;
  file: any[];
  createdAt: string;
  updatedAt: string;
  isDelete: boolean;
  deleteDate: string | null;
  comment: string;
  updateBy: string;
  createBy: string;
  isBookBank: boolean;
  bankName: string | null;
  bankAccountName: string | null;
  accountNumber: string | null;
  isConsentBookBank: boolean;
  isIdCard: boolean;
  documentComplete: boolean;
}

interface Props {
  children: JSX.Element;
}

interface State {
  isLoading: boolean;
  isDoneAuth: boolean;
  user: null | Droner;
  droneList?: Drone[];
  countNoti?: number;
}

interface Action {
  type: string;
  user?: any;
  isDoneAuth?: boolean;
  droneList?: Drone[];
  countNoti?: number;
}
interface LoginPayload {
  telNumber: string;
  value: string;
  tokenOtp: string;
  codeRef: string;
}

interface Context {
  authContext: {
    getProfileAuth: () => Promise<any>;
    login: (v: LoginPayload) => Promise<any>;
    getDroneList: (payload: {page: number; limit: number}) => Promise<any>;
    getNotiList: () => void;
  };
  setUser: (user: Droner) => void;
  state: State;
}

const initialState = {
  user: null,
  isLoading: true,
  isDoneAuth: true,
  droneList: [],
  countNoti: 0,
};

const AuthContext = React.createContext<Context>({
  authContext: {
    getProfileAuth: Promise.resolve,
    login: Promise.resolve,
    getDroneList: Promise.resolve,
    getNotiList: () => {},
  },
  setUser: () => {},
  state: initialState,
});

export const AuthProvider: React.FC<Props> = ({children}) => {
  const reducer = (prevState: State, action: Action): State => {
    switch (action.type) {
      case 'GET_ME':
        return {
          ...prevState,
          user: action.user,
        };
      case 'CHECK_AUTH':
        return {
          ...prevState,
          isDoneAuth: action.isDoneAuth ? action.isDoneAuth : false,
        };
      case 'LOGIN': {
        return {
          ...prevState,
          user: action.user,
        };
      }
      case 'GET_DRONE_LIST': {
        return {
          ...prevState,
          droneList: action.droneList,
        };
      }
      case 'SET_USER': {
        return {
          ...prevState,
          user: action.user,
        };
      }
      case 'SET_HAVE_NOTI': {
        return {
          ...prevState,
          countNoti: action.countNoti,
        };
      }

      default:
        return prevState;
    }
  };
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState,
  );

  const authContext = React.useMemo(
    () => ({
      getProfileAuth: async () => {
        try {
          const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
          const data = await ProfileDatasource.getProfile(dronerId);

          if (data) {
            dispatch({type: 'GET_ME', user: data});

            const isDoneAuth =
              data.status === 'ACTIVE' && data.documentComplete;

            dispatch({
              type: 'CHECK_AUTH',
              isDoneAuth,
            });
          }
          return data;
        } catch (e: any) {
          console.log(e);
        }
      },
      login: async (payload: LoginPayload) => {
        const result = await Authentication.login({
          telephoneNo: payload.telNumber,
          otpCode: payload.value,
          token: payload.tokenOtp,
          refCode: payload.codeRef,
        });
        dispatch({type: 'LOGIN', user: result.data});
        return result;
      },
      getDroneList: async ({
        page = 1,
        limit = 10,
      }: {
        page: number;
        limit: number;
      }) => {
        const result = await ProfileDatasource.getDroneBrand(page, limit);
        dispatch({type: 'GET_DRONE_LIST', droneList: result.data});
      },
      getNotiList: async () => {
        FCMtokenDatasource.getNotificationList()
          .then(res => {
            const count = res.data.filter((item: any) => !item.isRead);
            dispatch({type: 'SET_HAVE_NOTI', countNoti: count.length || 0});
          })
          .catch(err => console.log(err));
      },
    }),
    [],
  );

  React.useEffect(() => {
    if (!state.user) {
      AsyncStorage.getItem('droner_id').then(dronerId => {
        if (!dronerId) {
          return;
        }
        authContext.getProfileAuth();
      });
    }
  }, [authContext, state.user]);

  return (
    <AuthContext.Provider
      value={{
        authContext,
        state,
        setUser: (user: Droner) => {
          dispatch({type: 'SET_USER', user});
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): Context => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth can be use in AuthContext only');
  }
  return context;
};
