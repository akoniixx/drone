import {View, StyleSheet, Platform, ScrollView} from 'react-native';
import React, {useMemo} from 'react';
import {StackParamList} from '../../navigations/MainNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import {colors, font} from '../../assets';
import Text from '../../components/Text';
import StepOne from './StepOne';
import AsyncButton from '../../components/Button/AsyncButton';
import StepTwo from './StepTwo';
import ReviewStep from './ReviewStep';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import {useAuth} from '../../contexts/AuthContext';
import {mixpanel} from '../../../mixpanel';

const staticData = [
  {
    key: 0,
    title: 'ภาพถ่าย\nหลักฐานการบิน ',
  },
  {
    key: 1,
    title: 'ภาพถ่ายปุ๋ย/ยา',
  },
];
export interface ImageDataType {
  errorMessage?: string | null;
  isError?: boolean;
  assets: {
    fileSize: number;
    type: string;
    fileName: string;
    uri: string;
    errorMessage?: string[];
    isError?: boolean;
    errorTypeList?: Array<
      'isAfter' | 'isBefore' | 'isSize' | 'isType' | 'isDuplicate'
    >;
  }[];
}

export interface ImageSprayType {
  errorMessage?: string | null;
  isError?: boolean;
  assets: {
    fileSize: number;
    type: string;
    fileName: string;
    uri: string;
  }[];
}
interface Props {
  navigation: StackNavigationProp<StackParamList, 'FinishTaskScreen'>;
  route: RouteProp<StackParamList, 'FinishTaskScreen'>;
}
export default function FinishTaskScreen({navigation, route}: Props) {
  const {
    state: {user},
  } = useAuth();
  const [imageData, setImageData] = React.useState<ImageDataType>({
    isError: false,
    assets: [],
  });
  const [imageSpray, setImageSpray] = React.useState<ImageSprayType>({
    isError: false,
    assets: [],
  });
  const {taskAppointment, taskId, isFromTaskDetail} = route.params;
  const onPressBack = () => {
    navigation.goBack();
  };
  const [step, setStep] = React.useState(0);
  const RenderStep = useMemo(() => {
    if (step === 0) {
      return () => (
        <StepOne
          imageData={imageData}
          setImageData={setImageData}
          taskAppointment={taskAppointment}
        />
      );
    }

    return () => (
      <StepTwo
        imageSpray={imageSpray}
        setImageSpray={setImageSpray}
        taskAppointment={taskAppointment}
      />
    );
  }, [
    step,
    setImageData,
    imageData,
    taskAppointment,
    imageSpray,
    setImageSpray,
  ]);
  const onNextStep = () => {
    setStep(step + 1);
  };
  const onCancel = () => {
    if (step < 1) {
      setStep(0);
      setImageData({
        isError: false,
        assets: [],
      });
      onPressBack();
    } else {
      setStep(step - 1);
    }
  };
  const onSubmitTask = async ({
    rating,
    comment,
    onProgressUpload,
  }: {
    rating: number;
    comment: string;
    onProgressUpload: (progress: number) => void;
  }) => {
    try {
      const multiList = (imageData.assets || []).map((item, index) => {
        return TaskDatasource.multiUploadImage({
          file: item,
          taskId: taskId,
          updateBy: user?.firstname + ' ' + user?.lastname,
          onProgressUpload: (progress: number) => {
            const overallProgress =
              (index + progress) / imageData.assets.length;
            if (onProgressUpload) {
              onProgressUpload(overallProgress);
            }
          },
        });
      });
      await Promise.all(multiList);
      const result = await TaskDatasource.finishTask({
        fileDrug: imageSpray,
        taskId: taskId,
        updateBy: user?.firstname + ' ' + user?.lastname,
        reviewFarmerComment: comment,
        reviewFarmerScore: rating,
      });
      onProgressUpload(100);
      mixpanel.track('FinishTaskScreen_ReviewStep_Submit', {
        rating,
        comment,
        taskId,
      });
      return {
        success: true,
      };
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <SafeAreaView style={styles.safeView}>
      {step > 1 ? (
        <ReviewStep
          onPressBack={onCancel}
          onSubmit={onSubmitTask}
          navigation={navigation}
          taskId={taskId}
          isFromTaskDetail={isFromTaskDetail}
        />
      ) : (
        <>
          <CustomHeader
            title={'งานเสร็จสิ้น'}
            onPressBack={step < 1 ? onPressBack : onCancel}
            showBackBtn
          />
          <Text style={styles.subTitle}>กรุณาอัพโหลดภาพงานเสร็จสิ้น 2 ภาพ</Text>

          <ScrollView
            style={styles.container}
            contentContainerStyle={{
              flexGrow: 1,
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 16,
                    borderBottomColor: colors.disable,
                    borderBottomWidth: 1,
                  }}>
                  {staticData.map((item, index) => {
                    const isActive = index === step;
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isActive
                            ? colors.orangeSoft
                            : colors.white,

                          flex: 1,
                          minHeight: 60,
                          paddingHorizontal: 8,

                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}>
                        <View
                          style={{
                            backgroundColor: isActive
                              ? colors.orange
                              : colors.white,
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 8,
                            borderWidth: isActive ? 0 : 1,
                            borderColor: colors.grey3,
                          }}>
                          <Text
                            style={{
                              lineHeight: Platform.OS === 'android' ? 24 : 24,
                              fontFamily: font.semiBold,
                              fontSize: 18,
                              textAlign: 'center',
                              textAlignVertical: 'center',
                              color: isActive ? colors.white : colors.grey3,
                            }}>
                            {index + 1}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                          }}>
                          <Text
                            style={{
                              fontFamily: font.semiBold,
                              fontSize: 16,
                              color: isActive ? colors.fontBlack : colors.grey3,
                            }}>
                            {item.title}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
                <RenderStep />
              </View>
              <View style={styles.rowFooter}>
                <AsyncButton
                  onPress={onCancel}
                  type="secondary"
                  title={step < 1 ? 'ยกเลิก' : 'ย้อนกลับ'}
                  style={{
                    flex: 1,
                  }}
                />
                <View
                  style={{
                    width: 16,
                  }}
                />
                <AsyncButton
                  onPress={onNextStep}
                  title="ถัดไป"
                  style={{
                    flex: 1,
                  }}
                  disabled={
                    step === 0
                      ? imageData?.assets?.length < 1 || imageData?.isError
                      : imageSpray?.assets?.length < 1 || imageSpray?.isError
                  }
                />
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  safeView: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
  },
  subTitle: {
    fontSize: 16,
    color: colors.fontBlack,
    marginBottom: 8,
    textAlign: 'center',
  },
  rowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
});
