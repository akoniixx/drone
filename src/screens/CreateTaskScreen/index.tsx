import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {StackParamList} from '../../navigations/MainNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import {colors} from '../../assets';
import StepIndicator from '../../components/StepIndicator/StepIndicator';
import AsyncButton from '../../components/Button/AsyncButton';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import {createTaskDatasource} from '../../datasource/CreateTaskDatasource';
import {FarmerResponse} from '../../entities/FarmerInterface';

type Props = {
  navigation: StackNavigationProp<StackParamList, 'CreateTaskScreen'>;
  route: RouteProp<StackParamList, 'CreateTaskScreen'>;
};

export interface InputData {
  date: Date;
  time: {
    hour: number;
    minute: number;
  };
  plotDetail: {
    plotId: string;
    plotName: string;
  };
  raiAmount?: number;
}
const stepData = ['รายละเอียดงาน', 'เตรียมยา', 'สรุปงาน'];
const CreateTaskScreen = ({route, navigation}: Props) => {
  const {farmerId} = route.params;
  const [taskData, setTaskData] = React.useState<InputData>({
    date: new Date(),
    time: {
      hour: 6,
      minute: 0,
    },
    plotDetail: {
      plotId: '',
      plotName: '',
    },
  });
  const [step, setStep] = React.useState(0);
  const [loadingFarmer, setLoadingFarmer] = React.useState(false);
  const [farmerData, setFarmerData] = React.useState<FarmerResponse>(
    {} as FarmerResponse,
  );
  useFocusEffect(
    useCallback(() => {
      const getFarmerData = async () => {
        try {
          setLoadingFarmer(true);
          const result = await createTaskDatasource.getFarmerById(farmerId);
          if (result) {
            const newValue = {
              ...result,
            };
            const findProfileImage = (result.file || []).find(
              (v: {category: string}) => v.category === 'PROFILE_IMAGE',
            );
            if (findProfileImage) {
              const res = await createTaskDatasource.getImageByPath({
                path: findProfileImage?.path,
              });
              if (res) {
                newValue.profileImage = res.url;
              }
            }
            setFarmerData(newValue);
          }
          setLoadingFarmer(false);
        } catch (e) {
          console.log(e);
        } finally {
          setLoadingFarmer(false);
        }
      };
      getFarmerData();
    }, [farmerId]),
  );

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
        return (
          <StepOne
            farmer={farmerData}
            taskData={taskData}
            setTaskData={setTaskData}
            loadingFarmer={loadingFarmer}
          />
        );
      case 1:
        return <StepTwo />;
      case 2:
        return <StepThree />;
      default:
        return null;
    }
  }, [step, farmerData, setTaskData, taskData, loadingFarmer]);

  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingBottom: 16,
      }}>
      <CustomHeader title="สร้างงาน" showBackBtn onPressBack={onPressBack} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
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
      </KeyboardAvoidingView>
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
