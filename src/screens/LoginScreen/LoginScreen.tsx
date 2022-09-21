import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {InputPhone} from '../../components/InputPhone';
import {MainButton} from '../../components/Button/MainButton';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {Authentication} from '../../datasource/AuthDatasource';

const LoginScreen: React.FC<any> = ({navigation}) => {
  const [value, setValue] = useState<string>('');
  const [isError, setIsError] = React.useState(false);
  const [errMessage, setErrMessage] = useState<string>('');

  const [message, setMessage] = React.useState<string>('');
  const login = () => {
    Authentication.generateOtp(value)
      .then(result => {
          const telNumber = value;
          setValue('')
          navigation.navigate('OtpScreen', {
            telNumber: telNumber,
            token: result.result.token,
            refCode: result.result.refCode,
            isRegisterScreen: false,
          });
      })
      .catch(err => {
        if (err.response.data.statusCode === 409) {
          setErrMessage('เบอร์นี้ถูกลงทะเบียนเรียบร้อยแล้ว');
        }
        else if(err.response.data.statusCode === 400){
          setErrMessage('ไม่พบเบอร์โทรนี้ในระบบโปรดลงทะเบียนอีกครั้ง')
        }else if(err){
          Toast.show({
            type: 'error',
            text1: `ระบบเครือขายมีปัญหา กรุณาลองใหม่อีกครั้งในภายหลัง`,
          });
        }
      });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={stylesCentral.container}>
          <CustomHeader
            title="เข้าสู่ระบบ"
            showBackBtn
            onPressBack={() => navigation.goBack()}
          />

          <View style={styles.inner}>
            <View style={styles.containerTopCard}>
              <Text style={styles.headText}>ระบุหมายเลขโทรศัพท์ของคุณ</Text>
              <InputPhone
                value={value}
                onChangeText={(e: string) => setValue(e)}
                maxLength={10}
                autoFocus={true}
                onError={isError}
                errorMessage={message}
              />
              {errMessage.length > 0 ? (
                <Text
                  style={{marginTop: 5, color: 'red', fontFamily: font.medium}}>
                  {errMessage}
                </Text>
              ) : null}
              <Text style={styles.label}>
                โปรดใช้หมายเลขโทรศัพท์ที่ลงทะเบียนไว้กับแอปพลิเคชั่น DnDs
              </Text>
            </View>

            <View>
              <MainButton
                label="ถัดไป"
                color={colors.orange}
                onPress={() => login()}
                disable={value.length != 10}
              />

              <MainButton
                label="ลงทะเบียนนักบินโดรน"
                color={colors.white}
                fontColor={'black'}
                onPress={() => console.log('2')}
              />
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: normalize(17),
    flex: 1,
    justifyContent: 'space-around',
  },
  headText: {
    fontFamily: font.bold,
    fontSize: normalize(20),
    marginBottom: normalize(24),
  },
  label: {
    fontFamily: font.light,
    fontSize: normalize(14),
    color: colors.gray,
    marginTop: normalize(24),
  },
  containerTopCard: {
    flex: 1,
    paddingTop: normalize(70),
  },
});
