import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {normalize} from '@rneui/themed';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

import {FlatList} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {colors, image, icons} from '../../assets';
import fonts from '../../assets/fonts';

import Tasklists from '../../components/TaskList/Tasklists';
import {TaskDatasource} from '../../datasource/TaskDatasource';

import {stylesCentral} from '../../styles/StylesCentral';
import {dataUpdateStatusEntity} from '../../entities/TaskScreenEntities';
import * as RootNavigation from '../../navigations/RootNavigation';
import {callcenterNumber} from '../../definitions/callCenterNumber';
import MyProfileScreen from '../ProfileVerifyScreen/MyProfileScreen';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {useAuth} from '../../contexts/AuthContext';
import WarningDocumentBox from '../../components/WarningDocumentBox/WarningDocumentBox';
import Text from '../../components/Text';
import {RefreshControl} from 'react-native';
import Loading from '../../components/Loading/Loading';
import NetworkLost from '../../components/NetworkLost/NetworkLost';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {mixpanel} from '../../../mixpanel';

interface Prop {
  navigation: any;
  dronerStatus: string;
}

const initialPage = 1;
const limit = 10;
const TaskScreen: React.FC<Prop> = (props: Prop) => {
  const isFetching = React.useRef(false);

  const dronerStatus = props.dronerStatus;
  const {
    state: {isDoneAuth},
  } = useAuth();
  const [page, setPage] = useState<number>(initialPage);
  const navigation = RootNavigation.navigate;
  const [error] = useState<string>('');
  const [data, setData] = useState<{
    data: any;
    count: number;
  }>({
    data: [],
    count: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [checkResIsComplete, setCheckResIsComplete] = useState<boolean>(false);

  // const [toggleModalStartTask, setToggleModalStartTask] =
  //   useState<boolean>(false);

  // const [toggleModalReview, setToggleModalReview] = useState<boolean>(false);
  const [imgUploaded] = useState<boolean>(false);
  const [finishImg, setFinishImg] = useState<any>(null);
  const [defaultRating, setDefaultRating] = useState<number>(0);
  const [maxRatting] = useState<Array<number>>([1, 2, 3, 4, 5]);
  const [comment, setComment] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<{
    file: any;
    fileDrug: any;
  }>();
  const [loadingInfinite, setLoadingInfinite] = useState<boolean>(false);
  const [idUpload, setIdUpload] = useState<string>('');
  const [updateBy, setUpdateBy] = useState<string>('');
  const [percentSuccess, setPercentSuccess] = useState<number>(0);
  const [dataUpdateStatus, setDataUpdateStatus] =
    useState<dataUpdateStatusEntity>({
      id: '',
      dronerId: '',
      taskNo: '',
      updateBy: '',
    });
  const starImgFilled = icons.starfill;
  const starImgCorner = icons.starCorner;

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, []);
  const onEndReached = async () => {
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;

    if (data.data.length < data.count) {
      setLoadingInfinite(true);
      setPage(page + 1);
      const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
      TaskDatasource.getTaskById(
        droner_id,
        ['WAIT_START', 'IN_PROGRESS'],
        page + 1,
        limit,
      )
        .then(res => {
          if (res !== undefined) {
            setData({
              data: [...data.data, ...res.data],
              count: res.count,
            });
            setCheckResIsComplete(true);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          isFetching.current = false;
          setLoadingInfinite(false);
        });
    }
  };
  const startTask = () => {
    setLoading(true);
    // setToggleModalStartTask(false);
    TaskDatasource.updateTaskStatus(
      dataUpdateStatus.id,
      dataUpdateStatus.dronerId,
      'IN_PROGRESS',
      dataUpdateStatus.updateBy,
    )
      .then(() => {
        Toast.show({
          type: 'success',
          text1: `งาน #${dataUpdateStatus.taskNo}`,
          text2: 'อัพเดทสถานะเรียบร้อยแล้ว',
        });
        mixpanel.track('MainScreen_TaskInProgress_StartTask_Press', {
          taskNo: dataUpdateStatus.taskNo,
          taskId: dataUpdateStatus.id,
          updateBy: dataUpdateStatus.updateBy,
        });
        setLoading(false);
        setTimeout(() => getData(), 300);
      })
      .catch(err => console.log(err.response.data));
  };

  const showModalStartTask = (
    id: string,
    dronerId: string,
    taskNo: string,
    updateBy: string,
  ) => {
    setDataUpdateStatus({
      id: id,
      dronerId: dronerId,
      taskNo: taskNo,
      updateBy: updateBy,
    });

    // setToggleModalStartTask(true);
  };

  const openModalUpload = (name: string) => {
    setUpdateBy(name);
  };

  const onFinishTask = async () => {
    const payload = {
      taskId: idUpload,
      updateBy: updateBy,
      reviewFarmerComment: comment,
      reviewFarmerScore: defaultRating,
      file: imageFile?.file,
      fileDrug: imageFile?.fileDrug,
    };
    await TaskDatasource.finishTask(payload)
      .then(async () => {
        mixpanel.track('MainScreen_TaskInProgress_FinishTask_Press', {
          taskId: idUpload,
          updateBy: updateBy,
          comment: comment,
          defaultRating: defaultRating,
        });
        setFinishImg(null);
        setDefaultRating(0);
      })
      .catch(err => {
        console.log('error', err.response.data);
        // setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
        });
      });
  };

  const getData = async () => {
    setLoading(true);
    const droner_id = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskById(
      droner_id,
      ['WAIT_START', 'IN_PROGRESS'],
      initialPage,
      limit,
    )
      .then(res => {
        if (res !== undefined) {
          console.log(JSON.stringify(res, null, 2));
          setData(res);
          setCheckResIsComplete(true);
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });

    ProfileDatasource.getProfile(droner_id!).then(res => {
      setPercentSuccess(res.percentSuccess);
    });
  };

  const onPressSetTaskId = (id: string) => {
    setIdUpload(id);
  };

  const onChangeImgFinish = (payloadFile: any) => {
    setImageFile(payloadFile);
  };
  const onCloseSuccessModal = () => {
    setTimeout(() => navigation('TaskDetailScreen', {taskId: idUpload}), 500);
  };
  const RenderWarningDoc = useMemo(() => {
    if (!isDoneAuth) {
      return (
        <View
          style={{
            paddingBottom: 8,
          }}>
          <WarningDocumentBox navigation={props.navigation} />
        </View>
      );
    } else {
      return (
        <View
          style={{
            paddingBottom: 8,
          }}
        />
      );
    }
  }, [isDoneAuth, props.navigation]);

  const RenderWarningDocEmpty = useMemo(() => {
    if (!isDoneAuth && data.data.length < 1) {
      return () => (
        <View
          style={{
            paddingBottom: 8,
            paddingHorizontal: 8,
            height: normalize(80),
            backgroundColor: colors.grayBg,
          }}>
          <WarningDocumentBox navigation={props.navigation} />
        </View>
      );
    } else {
      return () => <View />;
    }
  }, [isDoneAuth, props.navigation, data]);
  return (
    <NetworkLost onPress={onRefresh}>
      <RenderWarningDocEmpty />
      {loading ? (
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <SkeletonPlaceholder
            backgroundColor={colors.skeleton}
            speed={2000}
            borderRadius={8}>
            <>
              {[1, 2].map(() => {
                return (
                  <SkeletonPlaceholder.Item
                    style={{
                      marginTop: 16,
                    }}>
                    <View
                      style={{
                        height: normalize(270),
                        width: '100%',
                      }}
                    />
                  </SkeletonPlaceholder.Item>
                );
              })}
            </>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <>
          {data.data.length !== 0 && checkResIsComplete ? (
            <View style={[{flex: 1}]}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                onEndReached={onEndReached}
                ListHeaderComponent={RenderWarningDoc}
                contentContainerStyle={{paddingHorizontal: 8}}
                ListFooterComponent={
                  loadingInfinite ? (
                    <View
                      style={{
                        padding: 16,
                      }}>
                      <Loading spinnerSize={40} />
                    </View>
                  ) : (
                    <View style={{height: 40}} />
                  )
                }
                keyExtractor={(element, index) =>
                  `${element.item.taskNo}-${index}`
                }
                data={data.data}
                extraData={data}
                renderItem={({item}: any) => {
                  return (
                    <Tasklists
                      {...item.item}
                      idTask={item.item.id}
                      onPressSetTaskId={onPressSetTaskId}
                      id={item.item.taskNo}
                      status={item.item.status}
                      title={item.item.farmerPlot.plantName}
                      price={
                        parseInt(item.item.price) +
                        parseInt(item.item.revenuePromotion)
                      }
                      date={item.item.dateAppointment}
                      address={item.item.farmerPlot.locationName}
                      distance={item.item.distance}
                      user={`${item.item.farmer.firstname} ${item.item.farmer.lastname}`}
                      img={item.image_profile_url}
                      preparation={item.item.comment}
                      tel={item.item.farmer.telephoneNo}
                      taskId={item.item.id}
                      farmArea={item.item.farmAreaAmount}
                      fetchTask={getData}
                      // toggleModalStartTask={toggleModalStartTask}
                      // setToggleModalStartTask={setToggleModalStartTask}
                      setShowModalStartTask={() =>
                        showModalStartTask(
                          item.item.id,
                          item.item.dronerId,
                          item.item.taskNo,
                          `${item.item.droner.firstname} ${item.item.droner.lastname}`,
                        )
                      }
                      startTask={startTask}
                      maxRatting={maxRatting}
                      setDefaultRating={setDefaultRating}
                      defaultRating={defaultRating}
                      starImgFilled={starImgFilled}
                      starImgCorner={starImgCorner}
                      imgUploaded={imgUploaded}
                      finishImg={finishImg}
                      onChangeImgFinish={onChangeImgFinish}
                      setComment={setComment}
                      comment={comment}
                      error={error}
                      onFinishTask={onFinishTask}
                      openModalUpload={() =>
                        openModalUpload(
                          `${item.item.droner.firstname} ${item.item.droner.lastname}`,
                        )
                      }
                      onCloseSuccessModal={onCloseSuccessModal}
                    />
                  );
                }}
              />
              <View />
            </View>
          ) : (
            <>
              {dronerStatus === 'ACTIVE' ? (
                <View
                  style={[
                    stylesCentral.center,
                    {flex: 1, backgroundColor: colors.grayBg, padding: 8},
                  ]}>
                  <Image
                    source={image.blankTask}
                    style={{width: normalize(136), height: normalize(111)}}
                  />
                  <Text style={stylesCentral.blankFont}>
                    ยังไม่มีงานที่ต้องทำ
                  </Text>
                </View>
              ) : (
                <View
                  style={[
                    stylesCentral.center,
                    {flex: 1, backgroundColor: colors.grayBg, padding: 8},
                  ]}
                />
              )}
              {dronerStatus == 'PENDING' ? (
                <View style={{backgroundColor: colors.grayBg}}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: normalize(10),
                      margin: normalize(10),
                      borderWidth: 2,
                      borderColor: colors.greyWhite,
                      borderRadius: 16,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          display: 'flex',
                          backgroundColor: '#FFF7F4',
                          paddingHorizontal: normalize(10),
                          paddingVertical: normalize(5),
                          borderRadius: 16,
                        }}>
                        <Text
                          style={{
                            color: '#B16F05',
                            fontFamily: fonts.bold,
                            fontSize: normalize(16),
                          }}>
                          รอตรวจสอบเอกสาร
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingBottom: normalize(20),
                        marginTop: normalize(5),
                      }}>
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: normalize(18),
                          color: 'black',
                        }}>
                        เจ้าหน้าที่กำลังตรวจสอบเอกสารการยืนยันตัวตน และ
                        โดรนของคุณอยู่ กรุณาตรวจสอบหากคุณยังไม่เพิ่มโดรน
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
              {dronerStatus == 'REJECTED' ? (
                <View style={{backgroundColor: colors.grayBg}}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: normalize(10),
                      margin: normalize(10),
                      borderWidth: 2,
                      borderColor: colors.greyWhite,
                      borderRadius: 16,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          display: 'flex',
                          backgroundColor: '#FFF7F4',
                          paddingHorizontal: normalize(10),
                          paddingVertical: normalize(5),
                          borderRadius: 16,
                        }}>
                        <Text
                          style={{
                            color: '#B16F05',
                            fontFamily: fonts.bold,
                            fontSize: normalize(16),
                          }}>
                          ยืนยันตัวตนไม่สำเร็จ
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingBottom: normalize(20),
                        marginTop: normalize(5),
                      }}>
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: normalize(18),
                          color: 'black',
                        }}>
                        โปรดติดต่อเจ้าหน้าที่ เพื่อดำเนินการแก้ไข โทร.{' '}
                        {callcenterNumber}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
              {dronerStatus == 'OPEN' ? (
                <View style={{backgroundColor: colors.grayBg}}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: normalize(10),
                      margin: normalize(10),
                      borderWidth: 2,
                      borderColor: colors.greyWhite,
                      borderRadius: 16,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          display: 'flex',
                          backgroundColor: '#FFF7F4',
                          paddingHorizontal: normalize(10),
                          paddingVertical: normalize(5),
                          borderRadius: 16,
                        }}>
                        <Text
                          style={{
                            color: '#B16F05',
                            fontFamily: fonts.bold,
                            fontSize: normalize(16),
                          }}>
                          รอยืนยันตัวตน
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        paddingBottom: normalize(20),
                        marginTop: normalize(5),
                      }}>
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: normalize(18),
                          color: 'black',
                        }}>
                        อีกนิดเดียว มากรอกข้อมูลโปรไฟล์ของคุณให้ ครบถ้วน
                        เพื่อเริ่มรับงานบินโดรนในระบบ
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Image
                        source={
                          Number(percentSuccess) === 50
                            ? image.inprogress50
                            : Number(percentSuccess) === 75
                            ? image.inprogress75
                            : image.inprogress100
                        }
                        style={{
                          width: normalize(50),
                          height: normalize(50),
                        }}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          navigation('MyProfileScreen', MyProfileScreen)
                        }>
                        <View style={styles.button}>
                          <Text style={styles.textButton}>
                            เพิ่มข้อมูลโปรไฟล์
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : null}
            </>
          )}
        </>
      )}
    </NetworkLost>
  );
};
export default TaskScreen;
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.orange,
    padding: 12,
    borderRadius: 20,
  },
  textButton: {
    fontFamily: fonts.bold,
    fontSize: normalize(14),
    color: colors.white,
  },
});
