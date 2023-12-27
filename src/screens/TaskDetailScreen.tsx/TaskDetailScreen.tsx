import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, icons, image} from '../../assets';
import {normalize} from '../../function/Normalize';
import CustomHeader from '../../components/CustomHeader';
import {MainButton} from '../../components/Button/MainButton';
import {ScrollView} from 'react-native-gesture-handler';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import fonts from '../../assets/fonts';
import {
  calTotalPrice,
  calTotalPromotion,
  dialCall,
  getStatusToText,
  momentExtend,
  numberWithCommas,
  openGps,
} from '../../function/utility';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {WaitStartFooter} from '../../components/Footer/WaitStartFooter';
import {InprogressFooter} from '../../components/Footer/InprogressFooter';
import Toast from 'react-native-toast-message';
import {SheetManager} from 'react-native-actions-sheet';
import {WaitReceiveFooter} from '../../components/Footer/WaitReceiveFooter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CModal from 'react-native-modal';
import {CanceledFooter} from '../../components/Footer/CanceledFooter';
import {callcenterNumber} from '../../definitions/callCenterNumber';
import Spinner from 'react-native-loading-spinner-overlay';
import * as RootNavigation from '../../navigations/RootNavigation';
import ExtendModal from '../../components/Modal/ExtendModal';
import StatusExtend from './StatusExtend';
import {mixpanel} from '../../../mixpanel';
import Banner from '../../components/Banner/GetPointBanner';
import ModalTaskDone from '../../components/Modal/ModalTaskDone';
import WarningDocumentBox from '../../components/WarningDocumentBox/WarningDocumentBox';
import {useAuth} from '../../contexts/AuthContext';
import Text from '../../components/Text';
import BadgeStatus from '../../components/BadgeStatus/BadgeStatus';
import NetworkLost from '../../components/NetworkLost/NetworkLost';
import {RefreshControl} from 'react-native';
import {checkDecimal} from '../../function/checkDecimal';
import {useIsFocused} from '@react-navigation/native';

const TaskDetailScreen: React.FC<any> = ({navigation, route}) => {
  const taskId = route.params.taskId;
  const isFinishTask = route.params.isFinishTask;
  const isFromTaskDetail = route.params.isFromTaskDetail || false;
  const isWaitStart = route.params.isWaitStart || false;
  const isFocused = useIsFocused();

  const [data, setData] = useState<any>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [dateAppointment, setDateAppointment] = useState<any>();
  const [profileImg, setProfileImg] = useState<string>();
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  var todate = new Date();
  const width = Dimensions.get('window').width;
  const {
    state: {isDoneAuth},
  } = useAuth();
  const [togleModalUpload, setTogleModalUpload] = useState<boolean>(false);
  const [togleModalReview, setTogleModalReview] = useState<boolean>(false);
  const [togleModalSuccess, setTogleModalSuccess] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<any>({
    file: null,
    fileDrug: null,
  });

  const onShowReviewModal = (payload: {file: any; fileDrug: any}) => {
    setTogleModalReview(true);
    setImageFile(payload);
  };

  const [defaulRating, setDefaulRating] = useState<number>(0);
  const [isVisibleExtendModal, setIsVisibleExtendModal] =
    useState<boolean>(false);
  const [maxRatting] = useState<Array<number>>([1, 2, 3, 4, 5]);
  const [comment, setComment] = useState<string>('');
  const starImgFilled = icons.starfill;
  const starImgCorner = icons.starCorner;
  const [loading, setLoading] = useState<boolean>(false);
  const [showModalStartTask, setShowModalStartTask] = useState<boolean>(false);
  const [dronerId, setDronerId] = useState<string>('');
  const ReviewBar = () => {
    return (
      <View style={styles.reviewBar}>
        {maxRatting.map(item => {
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              key={item}
              onPress={() => setDefaulRating(item)}>
              <Image
                style={styles.star}
                source={item <= defaulRating ? starImgFilled : starImgCorner}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  useEffect(() => {
    getDronerId();
    getTaskDetail();
    if (isFinishTask) {
      setTimeout(() => {
        setTogleModalSuccess(true);
      }, 1000);
      setTimeout(() => {
        setTogleModalSuccess(false);
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, isFocused]);

  const onFinishTask = () => {
    setTogleModalReview(false);
    setTimeout(() => setLoading(true), 500);
    const payload = {
      taskId: data.id,
      updateBy: `${data.droner.firstname} ${data.droner.lastname}`,
      reviewFarmerComment: comment,
      reviewFarmerScore: defaulRating,
      file: imageFile?.file,
      fileDrug: imageFile.fileDrug,
    };
    TaskDatasource.finishTask(payload)
      .then(() => {
        setLoading(false);
        mixpanel.track('TaskDetailScreen_FinishTaskButton_Press', {
          taskId,
          updateBy: `${data.droner.firstname} ${data.droner.lastname}`,
          comment,
          reviewFarmerScore: defaulRating,
        });
        setTimeout(() => setTogleModalSuccess(true), 200);
        setTimeout(() => getTaskDetail(), 300);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateTask = (status: string) => {
    if (status === 'WAIT_START') {
      setLoading(true);
      setShowModalStartTask(false);
      TaskDatasource.updateTaskStatus(
        data.id,
        data.droner.id,
        'IN_PROGRESS',
        `${data.droner.firstname} ${data.droner.lastname}`,
      )
        .then(() => {
          mixpanel.track('TaskDetailScreen_StartTaskButton_Press', {
            taskId,
            updateBy: `${data.droner.firstname} ${data.droner.lastname}`,
            dronerId: data.droner.id,
          });
          Toast.show({
            type: 'success',
            text1: `งาน ${data.taskNo}`,
            text2: 'อัพเดทสถานะเรียบร้อยแล้ว',
          });
          setLoading(false);
          getTaskDetail();
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  const getTaskDetail = async () => {
    const droner_Id = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskDetail(taskId, droner_Id)
      .then(res => {
        if (res.success) {
          setData(res.responseData.data);
          let date = new Date(res.responseData.data.dateAppointment);
          setDateAppointment(date);
          if (Object.keys(res.responseData.image_profile_url).length !== 0) {
            setProfileImg(res.responseData.image_profile_url);
          }

          setPosition({
            latitude: parseFloat(res.responseData.data.farmerPlot.lat),
            longitude: parseFloat(res.responseData.data.farmerPlot.long),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        } else {
          RootNavigation.navigate('Main', {
            screen: 'MainScreen',
          });
        }
      })
      .catch(err => console.log(err));
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await getTaskDetail();
    setRefreshing(false);
  };
  const receiveTask = async () => {
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.receiveTask(data.id, droner_id, true)
      .then(res => {
        if (res.success) {
          getTaskDetail();
          Toast.show({
            type: 'receiveTaskSuccess',
            text1: `งาน #${data.taskNo}`,
            text2: `วันที่  ${momentExtend.toBuddhistYear(
              new Date(),
              'DD MMMM YYYY',
            )}`,
            onPress: () => {
              Toast.hide();
            },
          });
        } else {
          RootNavigation.navigate('Main', {
            screen: 'MainScreen',
          });
          Toast.show({
            type: 'error',
            text1: res.userMessage,
          });
        }
      })
      .catch(err => console.log(err));
  };
  const rejectTask = async () => {
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.receiveTask(data.id, droner_id, false)
      .then(() => {
        navigation.goBack();
      })
      .catch(err => console.log(err));
  };

  const convertDate = (date: string) => {
    const cdate = new Date(date);
    return cdate;
  };

  const getDronerId = async () => {
    setDronerId((await AsyncStorage.getItem('droner_id')) ?? '');
  };
  const onPressBack = () => {
    if (isFromTaskDetail) {
      navigation.navigate('MainScreen', {
        screen: 'myTask',
      });
    } else if (isWaitStart) {
      navigation.navigate('myTask', {
        initialTab: 1,
      });
    } else {
      // navigation.goBack();
      navigation.navigate('myTask', {
        initialTab: 1,
      });
    }
  };

  const onPressFinishTask = () => {
    navigation.navigate('FinishTaskScreen', {
      taskId: taskId,
      isFromTaskDetail: true,
      taskAppointment: data.dateAppointment,
    });
  };
  return (
    <View style={{flex: 1}}>
      <CustomHeader
        title="รายละเอียดงาน"
        showBackBtn
        onPressBack={onPressBack}
      />
      <NetworkLost onPress={onRefresh}>
        {data ? (
          <>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={false}
              persistentScrollbar={false}>
              {data.status == 'WAIT_REVIEW' || data.status == 'DONE' ? (
                <View style={{flex: 1, backgroundColor: '#2EC66E'}}>
                  <View
                    style={{
                      padding: normalize(18),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View>
                      <Text
                        style={{
                          fontFamily: font.bold,
                          fontSize: normalize(17),
                          color: 'white',
                        }}>
                        งานเสร็จสิ้น
                      </Text>
                      <Text
                        style={{
                          fontFamily: font.regular,
                          fontSize: normalize(12),
                          color: 'white',
                        }}>
                        ยินดีด้วยคุณบินงานสำเร็จแล้ว
                      </Text>
                    </View>
                    <Image
                      source={icons.ssbaner}
                      style={{width: normalize(54), height: normalize(54)}}
                    />
                  </View>
                </View>
              ) : null}
              {data.status !== 'DONE' ? <Banner /> : null}

              <View style={[styles.taskMenu, {marginVertical: 0}]}>
                <View style={styles.listTile}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: normalize(14),
                      color: '#9BA1A8',
                    }}>
                    #{data.taskNo}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: getStatusToText(data.status)?.bgcolor,
                        paddingHorizontal: normalize(12),
                        paddingVertical: normalize(5),
                        borderRadius: normalize(12),
                      }}>
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          color: getStatusToText(data.status)?.color,
                          fontSize: normalize(12),
                        }}>
                        {getStatusToText(data.status)?.label}
                      </Text>
                    </View>
                    <BadgeStatus
                      style={{
                        marginLeft: 4,
                      }}
                      status={data.status}
                      statusPayment={data.statusPayment}
                    />
                  </View>
                </View>
                <View style={styles.listTile}>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: normalize(19),
                      color: colors.fontBlack,
                      width: '75%',
                    }}>
                    {`${data.purposeSpray.purposeSprayName}  (${data.farmerPlot.plantName})`}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      color: '#2EC66E',
                      fontSize: normalize(17),
                      marginTop: 2,
                    }}>
                    ฿{' '}
                    {numberWithCommas(
                      calTotalPrice(data.price, data.revenuePromotion),
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingVertical: normalize(5),
                  }}>
                  <Image
                    source={icons.jobCard}
                    style={{
                      width: normalize(20),
                      height: normalize(20),
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      paddingLeft: normalize(8),
                      fontSize: normalize(14),
                      color: colors.fontBlack,
                    }}>{`${momentExtend.toBuddhistYear(
                    dateAppointment,
                    'DD MMM YYYY HH:mm',
                  )} น.`}</Text>
                </View>
                {data?.statusDelay !== null && (
                  <StatusExtend
                    status={data?.statusDelay || null}
                    dateDelay={data?.dateDelay || null}
                    delayRejectRemark={data?.delayRejectRemark || null}
                    delayRemark={data?.delayRemark || null}
                  />
                )}
              </View>
              <View style={styles.taskMenu}>
                <View style={styles.listTile}>
                  <Text style={styles.font16}>รายละเอียดงาน</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={styles.fontGray}>พืช</Text>
                    <Text style={styles.font16}>
                      {data.farmerPlot.plantName}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.fontGray}>พื้นที่</Text>
                    <Text style={styles.font16}>
                      {checkDecimal(data.farmAreaAmount)} ไร่
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.fontGray}>ปุ๋ย/ยา</Text>
                    <Text style={styles.font16}>{data.preparationBy}</Text>
                  </View>
                </View>
                {data?.preparationRemark && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: normalize(10),
                    }}>
                    <Image
                      style={{
                        width: normalize(20),
                        height: normalize(20),
                        marginRight: normalize(5),
                      }}
                      source={icons.bottleDarkGreen}
                    />
                    <Text
                      style={{
                        color: colors.grey2,
                        fontSize: 14,
                      }}>
                      {data.preparationRemark}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{backgroundColor: colors.white, padding: normalize(15)}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={icons.note}
                    style={{marginRight: 20, height: 28, width: 28}}
                  />
                  <Text style={styles.fontGray}>
                    {data.comment ? data.comment : '-'}
                  </Text>
                </View>
              </View>
              <View style={styles.taskMenu}>
                <View style={styles.listTile}>
                  <Text style={styles.font16}>เกษตรกร</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={profileImg ? {uri: profileImg} : icons.account}
                      style={{
                        width: normalize(24),
                        height: normalize(24),
                        borderRadius: 99,
                      }}
                    />
                    <Text
                      style={{
                        marginLeft: normalize(5),
                        fontFamily: font.medium,
                        color: 'black',
                        fontSize: normalize(15),
                      }}>
                      {`${data.farmer.firstname}` +
                        ' ' +
                        `${data.farmer.lastname}`}
                    </Text>
                  </View>
                  {!['WAIT_RECEIVE', 'CANCELED'].includes(data.status) ? (
                    <TouchableOpacity
                      onPress={() => dialCall(data.farmer.telephoneNo)}
                      style={styles.callFarmer}>
                      <Image
                        source={icons.calling}
                        style={{height: 20, width: 20}}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View style={{flexDirection: 'row', marginTop: normalize(10)}}>
                  <Image
                    source={icons.jobDistance}
                    style={{width: normalize(24), height: normalize(24)}}
                  />
                  <View style={{marginLeft: normalize(5)}}>
                    <Text
                      style={{
                        fontFamily: font.medium,
                        color: 'black',
                        fontSize: normalize(15),
                      }}>
                      {data.farmerPlot.plotArea
                        ? `${data.farmerPlot.plotArea.subdistrictName}/ ${data.farmerPlot.plotArea.districtName}/ ${data.farmerPlot.plotArea.provinceName}`
                        : '-'}
                    </Text>
                    <Text
                      style={{
                        fontFamily: font.regular,
                        color: colors.gray,
                        fontSize: normalize(13),
                      }}>
                      ระยะทาง{' '}
                      {data.status == 'WAIT_RECEIVE'
                        ? data.taskDronerTemp.find(
                            (x: any) => x.dronerId == dronerId,
                          ).distance
                        : data.distance}{' '}
                      กม.
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: normalize(10)}}>
                  <Text style={[styles.font16, {color: 'black'}]}>
                    จุดสังเกต
                  </Text>
                  <View
                    style={{
                      marginLeft: normalize(10),
                      marginTop: normalize(5),
                    }}>
                    <Text style={styles.fontGray}>
                      {data.farmerPlot.landmark}
                    </Text>
                  </View>
                </View>
                <MapView.Animated
                  style={styles.map}
                  zoomEnabled={false}
                  zoomTapEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                  scrollEnabled={false}
                  provider={PROVIDER_GOOGLE}
                  region={position}>
                  <Marker coordinate={position} />
                </MapView.Animated>

                <TouchableOpacity
                  style={styles.viewMap}
                  onPress={() =>
                    openGps(
                      position.latitude,
                      position.longitude,
                      data.farmerPlot.plotName,
                    )
                  }>
                  <Image
                    source={icons.direction}
                    style={{width: normalize(24), height: normalize(24)}}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontFamily: font.medium,
                      color: 'black',
                    }}>
                    ดูแผนที่
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.taskMenu}>
                <Text style={[styles.font16, {color: 'black'}]}>รายได้</Text>

                <View
                  style={[
                    stylesCentral.flexRowBetwen,
                    {marginVertical: normalize(5)},
                  ]}>
                  <Text style={styles.fontGray}>ค่าจ้าง</Text>
                  <Text style={styles.fontGray}>
                    {numberWithCommas(
                      calTotalPrice(data.price, data.revenuePromotion),
                    )}{' '}
                    ฿
                  </Text>
                </View>
                <View
                  style={[
                    stylesCentral.flexRowBetwen,
                    {marginVertical: normalize(5)},
                  ]}>
                  <Text style={styles.fontGray}>
                    ค่าธรรมเนียม (5% ของราคารวม)
                  </Text>
                  <Text style={styles.fontGray}>
                    {numberWithCommas(data.fee)} ฿
                  </Text>
                </View>

                {data.discountFee ? (
                  <View
                    style={[
                      stylesCentral.flexRowBetwen,
                      {marginVertical: normalize(5)},
                    ]}>
                    <Text style={[styles.fontGray]}>ส่วนลดค่าธรรมเนียม</Text>
                    <Text style={[styles.fontGray]}>
                      {data.discountFee !== '0' ? '- ' : null}{' '}
                      {numberWithCommas(data.discountFee)} ฿
                    </Text>
                  </View>
                ) : null}

                <View
                  style={[
                    stylesCentral.flexRowBetwen,
                    {marginVertical: normalize(5)},
                  ]}>
                  <Text style={[styles.fontGray, {color: 'black'}]}>
                    ยอดรายได้รวม
                  </Text>
                  <Text style={[styles.fontGray, {color: 'black'}]}>
                    {numberWithCommas(
                      calTotalPrice(data.price, data.revenuePromotion),
                    )}{' '}
                    ฿
                  </Text>
                </View>

                <View
                  style={{
                    padding: normalize(10),
                    backgroundColor: '#FAFAFB',
                    marginTop: 16,
                    borderWidth: 1,
                    borderColor: colors.disable,
                    borderRadius: 8,
                  }}>
                  <Text style={styles.fontIncomeDetail}>
                    รายละเอียดเพิ่มเติม
                  </Text>
                  <View
                    style={{
                      borderWidth: StyleSheet.hairlineWidth,
                      marginTop: normalize(8),
                      borderColor: colors.disable,
                    }}
                  />
                  <View style={{marginTop: 16}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: font.medium,
                        }}>
                        จากเกษตรกร
                      </Text>
                      <Text
                        style={{
                          fontFamily: font.semiBold,
                          color: colors.gray,
                        }}>
                        {data.totalPrice === '0'
                          ? '-'
                          : numberWithCommas(data.totalPrice) + ' ' + '฿'}
                      </Text>
                    </View>

                    {data.totalPrice === '0' ? (
                      <Text>รายการนี้ไม่มีเก็บเงินสดจากเกษตรกร</Text>
                    ) : (
                      <View
                        style={{
                          borderColor: colors.orange,
                          borderWidth: 1,
                          alignSelf: 'flex-start',
                          paddingVertical: 2,
                          paddingHorizontal: 4,
                          borderRadius: 6,
                          marginTop: 4,
                          backgroundColor: colors.white,
                        }}>
                        <Text
                          style={{
                            fontFamily: font.medium,
                            color: colors.orange,
                          }}>
                          เงินสด
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{marginTop: 16}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}>
                      <View
                        style={{
                          flex: 0.7,
                        }}>
                        <Text
                          style={{
                            fontFamily: font.medium,
                          }}>
                          จากบริษัท
                        </Text>
                        <Text
                          style={{
                            color: colors.greenSoft,
                            lineHeight: 20,
                            fontSize: 14,
                          }}>
                          หลังจากงานเสร็จสิ้น ท่านจะได้รับเงิน ภายใน 1-2
                          วันทำการ
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontFamily: font.semiBold,
                          color: colors.gray,
                        }}>
                        {numberWithCommas(
                          calTotalPromotion(
                            data?.discountCoupon,
                            data?.discountPromotion,
                            data?.revenuePromotion,
                            data?.discountCampaignPoint,
                          ),
                        )}{' '}
                        ฿
                      </Text>
                    </View>
                  </View>
                </View>

                {data.status == 'CANCELED' ? (
                  <View
                    style={{
                      marginTop: normalize(20),
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={icons.warningGrey}
                      style={{
                        marginRight: 8,
                        width: normalize(24),
                        height: normalize(24),
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: font.regular,
                        fontSize: normalize(14),
                        color: colors.gray,
                        flexShrink: 1,
                      }}>
                      งานถูกยกเลิก หากต้องการสอบถามข้อมูลเพิ่มเติม
                      กรุณาติดต่อเจ้าหน้าที่
                    </Text>
                  </View>
                ) : null}
                {!isDoneAuth && (
                  <WarningDocumentBox
                    style={{
                      marginTop: 16,
                    }}
                    screen="TASK_DETAIL"
                  />
                )}
              </View>
              {data?.statusDelay && data.statusDelay === 'APPROVED' ? (
                <View
                  style={{
                    marginVertical: normalize(10),
                    flexDirection: 'row',
                    paddingHorizontal: normalize(20),
                    alignItems: 'center',
                    minHeight: normalize(44),
                  }}>
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#F7F8FA',
                      borderWidth: 1,
                      borderColor: '#F3F4F6',
                      borderRadius: 8,
                      width: '100%',
                    }}>
                    <Image
                      source={icons.warningGrey}
                      style={{marginRight: 20, width: 32, height: 32}}
                    />
                    <Text
                      style={{
                        fontFamily: font.medium,
                        fontSize: normalize(12),
                        color: '#A5A7AB',
                        width: '85%',
                      }}>
                      คุณขอขยายเวลางานครบกำหนดที่ทางระบบกำหนดแล้ว
                      หากต้องการขยายงานเพิ่มเติม กรุณาติดต่อเจ้าหน้าที่
                    </Text>
                  </View>
                </View>
              ) : null}
            </ScrollView>

            {data.status == 'WAIT_RECEIVE' ? (
              <WaitReceiveFooter
                mainFunc={() => {
                  setOpenConfirmModal(true);
                }}
                togleModal={
                  () => {}
                  //  SheetManager.show('CallingSheet', {
                  //    payload: {tel: data.farmer.telephoneNo},
                  //  })
                }
                updatedAt={data.updatedAt}
              />
            ) : null}

            {data.status == 'WAIT_START' ? (
              <WaitStartFooter
                disable={
                  new Date(
                    convertDate(data.dateAppointment).setHours(
                      convertDate(data.dateAppointment).getHours() - 3,
                    ),
                  ) >= todate
                }
                mainFunc={() => setShowModalStartTask(true)}
                togleModal={() =>
                  SheetManager.show('CallingSheet', {
                    payload: {tel: data.farmer.telephoneNo},
                  })
                }
              />
            ) : null}

            {data.status == 'IN_PROGRESS' ? (
              <InprogressFooter
                togleModalExtend={() => {
                  setIsVisibleExtendModal(true);
                }}
                isProblem={data.isProblem || false}
                statusDelay={data.statusDelay || null}
                mainFunc={onPressFinishTask}
                togleModal={() =>
                  SheetManager.show('CallingSheet', {
                    payload: {tel: data.farmer.telephoneNo},
                  })
                }
              />
            ) : null}

            {data.status == 'CANCELED' ? (
              <CanceledFooter mainFunc={() => dialCall(callcenterNumber)} />
            ) : null}
          </>
        ) : null}
      </NetworkLost>

      <Modal transparent={true} visible={openConfirmModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              padding: normalize(20),
              backgroundColor: colors.white,
              width: width * 0.9,
              display: 'flex',
              justifyContent: 'center',
              borderRadius: normalize(8),
            }}>
            <View>
              <Text style={[styles.h2, {textAlign: 'center'}]}>
                ยืนยันการรับงาน?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setOpenConfirmModal(false);
                }}
                style={{
                  position: 'absolute',
                  top: normalize(4),
                  right: normalize(0),
                }}>
                <Image
                  source={icons.close}
                  style={{
                    width: normalize(14),
                    height: normalize(14),
                  }}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.label,
                  {textAlign: 'center', marginVertical: 5},
                ]}>
                กรุณากดยืนยันหากคุณต้องการรับงานนี้
              </Text>
            </View>
            <TouchableOpacity
              style={{
                marginTop: normalize(10),
                width: '100%',
                height: normalize(50),
                borderRadius: normalize(8),
                backgroundColor: colors.orange,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                receiveTask().then(() => {
                  setOpenConfirmModal(false);
                });
              }}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontWeight: '600',
                  fontSize: normalize(19),
                  color: '#ffffff',
                }}>
                รับงาน
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: normalize(10),
                width: '100%',
                height: normalize(50),
                borderRadius: normalize(8),
                borderWidth: 0.2,
                borderColor: 'grey',
                // backgroundColor: '#FB8705',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                rejectTask().then(() => {
                  setOpenConfirmModal(false);
                });
              }}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontWeight: '600',
                  fontSize: normalize(19),
                  color: colors.fontBlack,
                }}>
                ไม่รับงาน
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ModalTaskDone
        onOpenModal={() => {
          setTogleModalUpload(true);
        }}
        taskId={data && data.id}
        onShowReviewModal={onShowReviewModal}
        visible={togleModalUpload}
        onClose={() => {
          setTogleModalUpload(false);
        }}
      />
      <CModal isVisible={togleModalReview}>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            padding: normalize(15),
            borderRadius: 12,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(19),
                color: 'black',
                marginBottom: normalize(10),
              }}>
              ให้คะแนนรีวิว
            </Text>
          </View>
          <Text
            style={{
              fontFamily: font.medium,
              fontSize: normalize(16),
              color: 'black',
              marginBottom: 15,
            }}>
            ภาพรวมของเกษตรกร
          </Text>
          <ReviewBar />
          <Text
            style={{
              fontFamily: font.medium,
              fontSize: normalize(16),
              color: 'black',
              marginVertical: 15,
            }}>
            ความคิดเห็นเพิ่มเติม
          </Text>
          <TextInput
            allowFontScaling={false}
            style={{
              borderWidth: 1,
              borderRadius: normalize(8),
              borderColor: colors.greyWhite,
              height: normalize(45),
            }}
            placeholder="กรอกความคิดเห็นเพิ่มเติม"
            onChangeText={setComment}
            value={comment}
          />
          <MainButton
            label="ยืนยัน"
            color={colors.orange}
            disable={defaulRating == 0}
            onPress={onFinishTask}
          />
        </View>
      </CModal>
      <ExtendModal
        isVisible={isVisibleExtendModal}
        taskId={taskId}
        fetchTask={getTaskDetail}
        onCloseModal={() => setIsVisibleExtendModal(false)}
      />
      <CModal isVisible={togleModalSuccess}>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            padding: normalize(15),
            borderRadius: 12,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(19),
                color: 'black',
                marginBottom: normalize(10),
              }}>
              ส่งงานสำเร็จ
            </Text>
            <Image
              source={image.reviewSuccess}
              style={{width: normalize(210), height: normalize(168)}}
              resizeMode="contain"
            />
          </View>
          {/* <MainButton
            label="ตกลง"
            color={colors.orange}
            onPress={onFinishTaskSuccess}
          /> */}
        </View>
      </CModal>
      <CModal isVisible={showModalStartTask} backdropOpacity={0.2}>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            padding: normalize(15),
            borderRadius: 12,
          }}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: font.bold,
                fontSize: normalize(19),
                color: 'black',
                marginBottom: normalize(10),
              }}>
              ยืนยันการเริ่มงาน?
            </Text>
            <Text
              style={{
                fontFamily: font.medium,
                fontSize: normalize(14),
                color: 'black',
                marginBottom: 15,
              }}>
              กรุณากดยืนยันหากต้องการเริ่มงานนี้
            </Text>
          </View>
          <MainButton
            label="เริ่มงาน"
            color={colors.orange}
            borderColor={colors.orange}
            fontColor="white"
            onPress={() => updateTask(data.status)}
          />
          <MainButton
            label="ยังไม่เริ่มงาน"
            color="white"
            borderColor={colors.gray}
            fontColor="black"
            onPress={() => setShowModalStartTask(false)}
          />
        </View>
      </CModal>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </View>
  );
};
export default TaskDetailScreen;
const styles = StyleSheet.create({
  taskMenu: {
    backgroundColor: '#fff',
    padding: normalize(15),
    marginVertical: normalize(5),
  },
  listTile: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 5,
  },
  font16: {
    fontFamily: fonts.semiBold,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  fontGray: {
    fontFamily: font.medium,
    fontSize: normalize(15),
    color: colors.gray,
  },
  map: {
    width: normalize(344),
    height: normalize(190),
    marginTop: normalize(10),
  },
  viewMap: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: 'white',
    borderColor: colors.primaryBlue,
    borderWidth: 1,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(50),
  },
  startButton: {
    width: normalize(275),
    height: normalize(52),
    backgroundColor: colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(8),
  },
  footer: {
    backgroundColor: colors.white,
    paddingHorizontal: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: normalize(10),
  },
  callFarmer: {
    width: 32,
    height: 32,
    backgroundColor: '#D7F2FF',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h2: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.regular,
    fontSize: normalize(14),
    color: colors.gray,
  },
  g19: {
    fontFamily: font.regular,
    fontSize: normalize(14),
    color: colors.gray,
  },

  reviewBar: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  star: {
    width: normalize(40),
    height: normalize(40),
    resizeMode: 'cover',
    marginHorizontal: 5,
  },
  fontIncomeDetail: {
    fontFamily: font.medium,
    fontSize: normalize(15),
    color: 'black',
  },
});
