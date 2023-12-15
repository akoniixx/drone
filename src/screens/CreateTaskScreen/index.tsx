import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {StackParamList} from '../../navigations/MainNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import {colors} from '../../assets';
import StepIndicator from '../../components/StepIndicator/StepIndicator';
import AsyncButton from '../../components/Button/AsyncButton';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';

type Props = {
  navigation: StackNavigationProp<StackParamList, 'CreateTaskScreen'>;
  route: RouteProp<StackParamList, 'CreateTaskScreen'>;
};
const stepData = ['รายละเอียดงาน', 'เตรียมยา', 'สรุปงาน'];
const CreateTaskScreen = ({route, navigation}: Props) => {
  const {farmerId} = route.params;
  const [step, setStep] = React.useState(0);
  const [farmerData, setFarmerData] = React.useState<any>({
    image: 'https://picsum.photos/200/300',
    name: 'นายสมชาย ใจดี',
    nickname: 'สมชาย',
    id: '1',
    tel: '0812345678',
    address: {
      subDistrict: 'สุรินทร์',
      district: 'สุรินทร์',
      province: 'สุรินทร์',
    },
  });
  const [taskData, setTaskData] = React.useState<any>({});
  const onPressBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else {
      setStep(step - 1);
    }
  };
  const RenderStep = useMemo(() => {
    switch (step) {
      case 0:
        return <StepOne farmer={farmerData} />;
      case 1:
        return <StepTwo />;
      case 2:
        return <StepThree />;
      default:
        return null;
    }
  }, [step, farmerData]);

  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingBottom: 16,
      }}>
      <CustomHeader title="สร้างงาน" showBackBtn onPressBack={onPressBack} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View style={styles.mainContent}>
          <StepIndicator labelList={stepData} currentPosition={step} />
          {RenderStep}
        </View>
        <View style={styles.footer}>
          <AsyncButton
            title="ถัดไป"
            onPress={() => {
              setStep(step + 1);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainContent: {
    flex: 1,
  },

  footer: {
    paddingBottom: 16,
  },
});
