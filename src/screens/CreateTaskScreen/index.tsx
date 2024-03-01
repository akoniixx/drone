import {Image, Linking, Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {StackParamList} from '../../navigations/MainNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import {colors, icons} from '../../assets';
import StepIndicator from '../../components/StepIndicator/StepIndicator';
import AsyncButton from '../../components/Button/AsyncButton';
import StepOne from './StepOne';
import StepTwo, {listData} from './StepTwo';
import StepThree from './StepThree';
import {createTaskDatasource} from '../../datasource/CreateTaskDatasource';
import {
  CreateTaskPayload,
  FarmerResponse,
} from '../../entities/FarmerInterface';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from '../../components/Modal/Modal';
import Text from '../../components/Text';
import {useAuth} from '../../contexts/AuthContext';
import moment from 'moment';
import {mixpanel} from '../../../mixpanel';
import {callcenterNumber} from '../../definitions/callCenterNumber';
import {lineOfficialURI} from '../../definitions/externalLink';

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
    cropName: string;
    plotName: string;
    rai: string;
    plotArea: {
      subdistrictName: string;
      districtName: string;
      provinceName: string;
      postcode: string;
    };
    shortPlotName: string;
  };
  raiAmount?: string;
  purposeSpray?: {
    id: string;
    purposeSprayName: string;
  };
  targetSpray: Array<string>;
  preparationBy: string;
  preparationRemark?: string;
}
export interface PurposeListType {
  id: string;
  cropId?: string;
  purposeSprayName: string;
}
export interface CalPriceType {
  couponId: string | null;
  couponName: string | null;
  pricePerRai: string;
  priceBefore: number;
  fee: number;
  discountFee: number;
  priceCouponDiscountStandard: number;
  priceCouponDiscount: number;
  netPrice: number;
  discountPromotion: number;
  discountPoint: number;
}
const initialData: InputData = {
  date: new Date(),
  time: {
    hour: 6,
    minute: 0,
  },
  plotDetail: {
    plotId: '',
    plotName: '',
    cropName: '',
    rai: '',
    plotArea: {
      subdistrictName: '',
      districtName: '',
      provinceName: '',
      postcode: '',
    },
    shortPlotName: '',
  },
  raiAmount: '',
  targetSpray: [],
  preparationBy: listData[0].value,
};
const stepData = ['รายละเอียดงาน', 'เตรียมยา', 'สรุปงาน'];
const CreateTaskScreen = ({route, navigation}: Props) => {
  const {farmerId} = route.params;
  const {
    state: {user},
  } = useAuth();
  const [showWarningServerDown, setShowWarningServerDown] =
    React.useState(false);
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [taskData, setTaskData] = React.useState<InputData>(initialData);
  const [purposeList, setPurposeList] = React.useState<PurposeListType[]>([]);
  const [step, setStep] = React.useState(0);
  const [loadingFarmer, setLoadingFarmer] = React.useState(false);
  const [farmerData, setFarmerData] = React.useState<FarmerResponse>(
    {} as FarmerResponse,
  );
  const [calPriceData, setCalPriceData] = React.useState<CalPriceType>(
    {} as CalPriceType,
  );
  const [listTargetSpray, setListTargetSpray] = React.useState<string[]>([]);
  useEffect(() => {
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
    const getListTargetSpray = async () => {
      const result = await createTaskDatasource.getTargetSpray();
      const newFormat = result.data.map((item: {name: string}) => item.name);
      setListTargetSpray(newFormat);
    };

    getFarmerData();
    getListTargetSpray();
  }, [farmerId]);
  const [taskId, setTaskId] = React.useState('');

  const onPressBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else {
      setStep(step - 1);
    }
  };
  const onPressToSummary = async () => {
    try {
      const result = await createTaskDatasource.calculatePriceTask({
        cropName: taskData.plotDetail.cropName,
        raiAmount: taskData.raiAmount ? parseFloat(taskData.raiAmount) : 0,
        farmerPlotId: taskData.plotDetail.plotId,
      });
      mixpanel.track('CreateTaskScreen_CalculatePrice', {
        ...taskData,
        cropName: taskData.plotDetail.cropName,
        raiAmount: taskData.raiAmount ? parseFloat(taskData.raiAmount) : 0,
        farmerPlotId: taskData.plotDetail.plotId,
        responseCal: result.responseData,
      });
      if (result?.success && result.responseData) {
        setCalPriceData(result.responseData);
        setStep(step + 1);
      } else {
        setShowWarningServerDown(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getPurposeSpray = async () => {
      try {
        const result = await createTaskDatasource.getPurposeSpray(
          taskData.plotDetail.cropName,
        );

        if (result) {
          setPurposeList(result[0]?.purposeSpray);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (taskData.plotDetail.cropName !== '') {
      getPurposeSpray();
    }
  }, [taskData?.plotDetail?.cropName]);
  const RenderStep = useMemo(() => {
    switch (step) {
      case 0:
        return (
          <StepOne
            farmer={farmerData}
            taskData={taskData}
            setTaskData={setTaskData}
            loadingFarmer={loadingFarmer}
            purposeList={purposeList}
            listTargetSpray={listTargetSpray}
            setListTargetSpray={setListTargetSpray}
          />
        );
      case 1:
        return (
          <StepTwo
            farmer={farmerData}
            setTaskData={setTaskData}
            taskData={taskData}
          />
        );
      case 2:
        return (
          <StepThree
            farmer={farmerData}
            taskData={taskData}
            calPriceData={calPriceData}
          />
        );
      default:
        return null;
    }
  }, [
    step,
    farmerData,
    setTaskData,
    taskData,
    loadingFarmer,
    purposeList,
    listTargetSpray,
    setListTargetSpray,
    calPriceData,
  ]);

  const disableNextStep = useMemo(() => {
    switch (step) {
      case 0:
        return (
          !taskData.plotDetail ||
          !taskData.raiAmount ||
          !taskData.purposeSpray?.purposeSprayName ||
          !taskData.targetSpray
        );
      case 1:
        return taskData.preparationBy === listData[1].value
          ? !taskData.preparationRemark
          : false;
      default:
        return false;
    }
  }, [step, taskData]);
  const onShowConfirmModal = () => {
    mixpanel.track('CreateTaskScreen_ConfirmModal_Press', {
      ...taskData,
      calPriceData,
    });
    setShowConfirmModal(true);
  };
  const onSubmitCreateTask = async () => {
    try {
      if (!user) {
        return;
      }
      const dateAppointment = moment(taskData.date)
        .set({
          hour: taskData.time.hour,
          minute: taskData.time.minute,
        })
        .toISOString();
      const payload: CreateTaskPayload = {
        createBy: `${user?.firstname} ${user?.lastname}`,
        farmerId: farmerId,
        cropName: taskData.plotDetail.cropName,
        dateAppointment: dateAppointment,
        discountFee: calPriceData.discountFee,
        distance: 0,
        dronerId: user?.id || '',
        farmAreaAmount: parseFloat(taskData.raiAmount || '0'),
        farmerPlotId: taskData.plotDetail.plotId,
        fee: calPriceData.fee,
        preparationBy: taskData.preparationBy,
        preparationRemark: taskData.preparationRemark,
        price: calPriceData.priceBefore,
        priceStandard: calPriceData.priceBefore,
        purposeSprayId: taskData.purposeSpray?.id || '',
        purposeSprayName: taskData.purposeSpray?.purposeSprayName || '',
        targetSpray: taskData.targetSpray,
        unitPrice: +calPriceData.pricePerRai,
        unitPriceStandard: +calPriceData.pricePerRai,
      };
      const result = await createTaskDatasource.createTask(payload);
      mixpanel.track('CreateTaskScreen_CreateTask_Press', {
        ...payload,
        responseCreateTask: result,
      });
      if (result && result.success) {
        const taskId = result.responseData.id;
        setTaskId(taskId);
        setShowConfirmModal(false);
        setShowSuccessModal(true);
      }
    } catch (e) {
      console.log(JSON.stringify(e, null, 2));
    }
  };
  const onToMainScreen = () => {
    mixpanel.track('CreateTaskScreen_ToMainScreen_Press', {
      taskId: taskId,
    });
    setShowSuccessModal(false);
    setTimeout(() => {
      navigation.navigate('MainScreen');
    }, 400);
  };
  const onToTaskDetailScreen = () => {
    mixpanel.track('CreateTaskScreen_ToTaskDetailScreen_Press', {
      taskId: taskId,
    });
    setShowSuccessModal(false);
    setTimeout(() => {
      navigation.navigate('TaskDetailScreen', {
        taskId: taskId,
        isWaitStart: true,
      });
    }, 400);
  };
  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingBottom: 16,
      }}>
      <CustomHeader
        title="สร้างงาน"
        showBackBtn
        onPressBack={onPressBack}
        styleTitle={{
          marginRight: 20,
        }}
      />
      <KeyboardAwareScrollView
        extraScrollHeight={100}
        scrollIndicatorInsets={{
          right: 1,
        }}
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
          <View style={styles.mainContent}>
            <StepIndicator labelList={stepData} currentPosition={step} />
            {RenderStep}
          </View>
          <View style={styles.footer}>
            <AsyncButton
              title={step >= 2 ? 'ยืนยันการสร้างงาน' : 'ถัดไป'}
              disabled={disableNextStep}
              onPress={() => {
                if (step === 1) {
                  onPressToSummary();
                } else if (step >= 2) {
                  onShowConfirmModal();
                } else {
                  setStep(step + 1);
                }
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <Modal
        visible={showConfirmModal}
        title={'ยืนยันการสร้างงาน?'}
        onClose={() => {
          setShowConfirmModal(false);
        }}
        onPressPrimary={onSubmitCreateTask}
        onPressSecondary={() => {
          setShowConfirmModal(false);
        }}
        subTitle={
          <>
            <Text style={{marginTop: 8}}>กรุณาตรวจสอบความถูกต้องของข้อมูล</Text>
            <Text
              style={{
                color: colors.decreasePoint,
                textAlign: 'center',
              }}>
              หากข้อมูลที่แจ้งเป็นเท็จ {'\n'} จะดำเนินการการตามเงื่อนไขบริษัทฯ
            </Text>
          </>
        }
      />
      <Modal
        visible={showSuccessModal}
        title={'สร้างงานสำเร็จ'}
        iconTop={
          <Image
            source={icons.successFillGreen}
            style={{
              width: 60,
              height: 60,
              marginBottom: 16,
            }}
          />
        }
        subTitle={
          <Text
            style={{
              marginTop: 8,
              textAlign: 'center',
            }}>
            กรุณาตรวจสอบงานที่สร้างผ่านแอปฯ {'\n'} นักบินโดรนของคุณอีกครั้ง
          </Text>
        }
        onPressPrimary={onToTaskDetailScreen}
        onPressSecondary={onToMainScreen}
        titlePrimary="ดูรายละเอียดงาน"
        titleSecondary="กลับไปหน้าหลัก"
      />
      <Modal
        visible={showWarningServerDown}
        onPressPrimary={() => {
          setShowWarningServerDown(false);
        }}
        showCancelBtn={false}
        title={`ระบบขัดข้อง!\nทีมงานกำลังเร่งดำเนินการแก้ไข`}
        titlePrimary="ตกลง"
        subTitle={
          <View
            style={{
              marginTop: 8,
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              alignSelf: 'flex-start',
            }}>
            <Text>วิธีเบื้องต้น</Text>
            <Text>• กรุณารอทีมงานแก้ไขสักครู่ และกลับมาใช้งานอีกครั้ง</Text>
            <Text>
              • หากท่านไม่สามารถดำเนินการขั้นตอนถัดไปได้เป็น ระยะเวลานาน
              กรุณาติดต่อเจ้าหน้าที่{' '}
              <Text
                style={styles.textDecoration}
                onPress={() => {
                  mixpanel.track('CreateTaskScreen_ContactPress');
                  Linking.openURL(`tel:${callcenterNumber}`);
                }}>
                02-233-6000
              </Text>{' '}
              หรือ{' '}
              <Text
                style={styles.textDecoration}
                onPress={() => {
                  mixpanel.track('CreateTaskScreen_ContactPress');
                  Linking.openURL(lineOfficialURI);
                }}>
                Line Official
              </Text>
            </Text>
          </View>
        }
      />
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
    paddingTop: 16,
  },
  textDecoration: {
    textDecorationLine: 'underline',
    color: colors.darkBlue,
  },
});
