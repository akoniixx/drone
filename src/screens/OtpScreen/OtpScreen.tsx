import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Authentication} from '../../datasource/AuthDatasource';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as RootNavigation from '../../navigations/RootNavigation';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {FCMtokenDatasource} from '../../datasource/FCMDatasource';
import {getFCMToken} from '../../firebase/notification';
import {mixpanel} from '../../../mixpanel';
import {useAuth} from '../../contexts/AuthContext';
import Text from '../../components/Text';

const CELL_COUNT = 6;

interface propsOTP {
  toggle: boolean;
}

interface props {
  index: number;
  symbol: string;
  isFocused: boolean;
}

const OtpScreen: React.FC<any> = ({navigation, route}) => {
  const [value, setValue] = useState<string>('');
  const {
    authContext: {login},
  } = useAuth();
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [isError] = useState(false);
  const [otpCalling, setOtpCalling] = useState(false);
  const [tokenOtp, setTokenOtp] = useState(route.params.token);
  const [codeRef, setCodeRef] = useState(route.params.refCode);
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [errOTP, setErrOTP] = useState(false);
  const newTokenOtp = useCallback((value: any) => {
    setTokenOtp(value);
  }, []);

  const newCodeRef = useCallback((value: any) => {
    setCodeRef(value);
  }, []);

  const [otpTimeOut, setOTPtimeout] = useState(120);
  const [time, setTime] = useState('02:00');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (otpCalling) {
      setOTPtimeout(120);
      setTime('02:00');
      setOtpCalling(false);
    }
  }, [otpCalling]);

  useEffect(() => {
    let timer = setInterval(() => {
      if (otpTimeOut === 0) {
      } else {
        let second = otpTimeOut - 1;
        setOTPtimeout(second);
        setTime(
          `0${parseInt((second / 60).toString())}:${
            second % 60 < 10 ? '0' + (second % 60) : second % 60
          }`,
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  const renderCell: React.FC<props> = ({index, symbol, isFocused}) => {
    return (
      <Text
        key={index}
        style={[
          !isError ? styles.cell : styles.cellError,
          isFocused || symbol ? styles.focusCell : null,
          {
            color: colors.fontBlack,
          },
        ]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </Text>
    );
  };

  const onFufill = async (value: string) => {
    if (route.params.isRegisterScreen) {
      setValue(value);
      if (value.length >= CELL_COUNT) {
        setLoading(true);

        try {
          login({
            codeRef: codeRef,
            value: value,
            tokenOtp: tokenOtp,
            telNumber: route.params.telNumber,
          })
            .then(async result => {
              setLoading(false);
              setErrOTP(false);

              await AsyncStorage.setItem('token_register', result.accessToken);
              mixpanel.track('OtpScreen_OtpInput_typed', {
                otp: value,
                tel: route.params.telNumber,
                to: 'FirstFormScreenV2',
              });
              navigation.navigate('FirstFormScreenV2', {
                tele: route.params.telNumber,
              });
            })
            .catch(err => {
              setLoading(false);
              setErrOTP(true);
              console.log(err);
            });
        } catch (e) {
          setLoading(false);
          setErrOTP(true);
          console.log(e, 'AsyncStorage.setItem');
        }
      }
    } else {
      setValue(value);
      if (value.length >= CELL_COUNT) {
        setLoading(true);
        try {
          login({
            codeRef: codeRef,
            value: value,
            tokenOtp: tokenOtp,
            telNumber: route.params.telNumber,
          })
            .then(async result => {
              setLoading(false);
              setErrOTP(false);
              await AsyncStorage.setItem('token', result.accessToken);
              await AsyncStorage.setItem('droner_id', result.data.id);
              await getFCMToken();
              const fcmtoken = await AsyncStorage.getItem('fcmtoken');
              FCMtokenDatasource.saveFCMtoken(fcmtoken!)
                .then(() => {
                  mixpanel.track('Login Success');
                  RootNavigation.navigate('Main', {
                    screen: 'MainScreen',
                  });
                })
                .catch(err => console.log(err));
            })
            .catch(err => {
              setLoading(false);
              setErrOTP(true);
              console.log(err);
            });
        } catch (e) {
          setLoading(false);
          setErrOTP(true);
          console.log(e, 'AsyncStorage.setItem');
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={stylesCentral.container}>
          <CustomHeader
            title="ยืนยันรหัส OTP"
            showBackBtn
            onPressBack={() => navigation.goBack()}
          />
          <View style={styles.inner}>
            <View style={styles.headContainer}>
              <View style={styles.rowDirection}>
                <Text style={styles.text}>รหัส OTP ถูกส่งไปยัง </Text>
                <Text style={[styles.text, {color: colors.orange}]}>
                  {route.params.telNumber}
                </Text>
              </View>
              <Text style={[styles.text, {color: colors.gray}]}>
                รหัสอ้างอิง OTP: {codeRef}
              </Text>
            </View>
            <CodeField
              ref={ref}
              {...props}
              value={value}
              onChangeText={onFufill}
              cellCount={CELL_COUNT}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={renderCell}
            />
            {errOTP ? (
              <Text style={styles.textError}>
                รหัส OTP ไม่ถูกต้องกรุณาลองอีกครั้ง
              </Text>
            ) : (
              <></>
            )}
            <View style={styles.otpQuestion}>
              <View style={styles.rowDirection}>
                <Text style={styles.text}>ไม่ได้รับรหัส OTP? </Text>
                {otpTimeOut === 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (route.params.isRegisterScreen) {
                        Authentication.generateOtpRegister(
                          route.params.telNumber,
                        )
                          .then(res => {
                            setValue('');
                            newTokenOtp(res.result.token);
                            newCodeRef(res.result.refCode);
                          })
                          .catch(err => console.log(err));
                      } else {
                        Authentication.generateOtp(route.params.telNumber)
                          .then(res => {
                            setValue('');
                            newTokenOtp(res.result.token);
                            newCodeRef(res.result.refCode);
                          })
                          .catch(err => console.log(err));
                      }
                      setOtpCalling(true);
                    }}>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: colors.orange,
                          textDecorationLine: 'underline',
                          textDecorationColor: colors.orange,
                        },
                      ]}>
                      ส่งอีกครั้ง
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.text}>{time}</Text>
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </KeyboardAvoidingView>
  );
};
export default OtpScreen;

const styles = StyleSheet.create({
  cell: {
    width: 55,
    height: 75,
    lineHeight: 70,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    textAlign: 'center',
    borderRadius: 8,
  },
  cellError: {
    width: 55,
    height: 75,
    lineHeight: 70,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#EB2C21',
    textAlign: 'center',
    borderRadius: 8,
  },
  focusCell: {
    borderColor: colors.orange,
    borderRadius: 8,
  },
  textError: {
    color: '#EB2C21',
    fontFamily: font.medium,
    marginTop: 15,
    fontSize: 16,
  },
  inner: {
    flex: 1,
    paddingHorizontal: normalize(15),
  },
  headContainer: {
    marginVertical: normalize(38),
    alignItems: 'center',
  },
  otpQuestion: {
    marginTop: normalize(38),
    alignItems: 'center',
  },
  timeCount: {
    marginTop: normalize(12),
    alignItems: 'center',
  },
  text: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  rowDirection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: normalize(10),
  },
});
