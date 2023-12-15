import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {InputPhone} from '../../components/InputPhone';
import {MainButton} from '../../components/Button/MainButton';
import {Authentication} from '../../datasource/AuthDatasource';
import Text from '../../components/Text';

const LoginScreen: React.FC<any> = ({navigation}) => {
  const [value, setValue] = useState<string>('');
  const [isError] = useState(false);
  const [message] = useState<string>('');
  const [errMessage, setErrMessage] = useState<string>('');
  const login = () => {
    Authentication.generateOtpRegister(value)
      .then(result => {
        navigation.navigate('OtpScreen', {
          telNumber: value,
          token: result.result.token,
          refCode: result.result.refCode,
          isRegisterScreen: true,
        });
      })
      .catch(err => {
        if (err.response.data.statusCode === 409) {
          setErrMessage('เบอร์นี้ถูกลงทะเบียนเรียบร้อยแล้ว');
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
            title="ลงทะเบียนนักบินโดรน"
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
            </View>

            <View>
              <MainButton
                label="ถัดไป"
                color={colors.orange}
                onPress={() => login()}
                disable={value.length != 10}
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
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.regular,
    fontSize: normalize(14),
    color: colors.gray,
    marginTop: normalize(24),
  },
  containerTopCard: {
    flex: 1,
    paddingTop: normalize(70),
  },
});
