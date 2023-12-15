import {normalize} from '@rneui/themed';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {colors, font, image} from '../../assets';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import {stylesCentral} from '../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import NewTask from '../../components/TaskList/NewTask';
import Toast from 'react-native-toast-message';
import icons from '../../assets/icons/icons';
import fonts from '../../assets/fonts';
import {momentExtend, socket} from '../../function/utility';
import {ActionContext} from '../../../App';
import {mixpanel} from '../../../mixpanel';
import {callcenterNumber} from '../../definitions/callCenterNumber';
import MyProfileScreen from '../ProfileVerifyScreen/MyProfileScreen';
import * as RootNavigation from '../../navigations/RootNavigation';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {useAuth} from '../../contexts/AuthContext';
import WarningDocumentBox from '../../components/WarningDocumentBox/WarningDocumentBox';
import NetworkLost from '../../components/NetworkLost/NetworkLost';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Text from '../../components/Text';

interface Prop {
  isOpenReceiveTask: boolean;
  dronerStatus: string;
  navigation: any;
}
const initialPage = 1;

const NewTaskScreen: React.FC<Prop> = (props: Prop) => {
  const {
    state: {isDoneAuth},
  } = useAuth();
  const navigation = RootNavigation.navigate;
  const dronerStatus = props.dronerStatus;
  const {isOpenReceiveTask} = props;
  const [data, setData] = useState<{
    data: any;
    count: number;
  }>({
    data: [],
    count: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  // const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // const handlePresentModalPress = useCallback(() => {
  //   bottomSheetModalRef.current?.present();
  // }, []);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const width = Dimensions.get('window').width;
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [dronerId, setDronerId] = useState<string>('');
  const {actiontaskId} = useContext(ActionContext);
  const [percentSuccess, setPercentSuccess] = useState<number>(0);
  const limit = 10;
  const getData = async () => {
    setLoading(true);
    const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskById(dronerId, ['WAIT_RECEIVE'], initialPage, limit)
      .then(res => {
        if (res !== undefined) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => console.log(err));

    ProfileDatasource.getProfile(dronerId!).then(res => {
      setPercentSuccess(res.percentSuccess);
    });
  };
  const onRefresh = React.useCallback(() => {
    try {
      setRefreshing(true);
      getData();
      setRefreshing(false);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const onLoadMore = async () => {
    if (data.data.length < data.count) {
      const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
      TaskDatasource.getTaskById(dronerId, ['WAIT_RECEIVE'], page + 1, limit)
        .then(res => {
          if (res !== undefined) {
            setData({
              data: [...data.data, ...res.data],
              count: res.count,
            });
            setPage(page + 1);
          }
        })
        .catch(err => console.log(err));
    }
  };
  const receiveTask = async () => {
    const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.receiveTask(selectedTaskId, dronerId, true)
      .then(res => {
        if (res.success) {
          const task = res.responseData.data;
          setData(data?.data?.filter((x: any) => x.item.id != task.id));
          Toast.show({
            type: 'receiveTaskSuccess',
            text1: `งาน #${task.taskNo}`,
            text2: `วันที่ ${momentExtend.toBuddhistYear(
              new Date(),
              'DD MMM YYYY',
            )}`,
            onPress: () => {
              Toast.hide();
            },
          });
        } else {
          getData();
          setData(data?.data?.filter((x: any) => x.item.id != selectedTaskId));
        }
      })
      .catch(err => console.log(err));
  };
  const rejectTask = async () => {
    const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.receiveTask(selectedTaskId, dronerId, false)
      .then(() => {
        setData(data?.data?.filter((x: any) => x.item.id != selectedTaskId));
      })
      .catch(err => console.log(err));
  };
  useFocusEffect(
    React.useCallback(() => {
      getData();
      return () => {
        disconnectSocket();
        setPage(initialPage);
      };
    }, []),
  );

  useEffect(() => {
    const onNewTask = async () => {
      const dronerId = await AsyncStorage.getItem('droner_id');
      socket.on(`send-task-${dronerId!}`, task => {
        setData(prev => ({
          data: [
            {image_profile_url: task.image_profile_url, item: task.data},
          ].concat(data?.data?.filter((x: any) => x.item.id != task.data.id)),
          count: prev.count + 1,
        }));
      });
    };
    onNewTask();
    // onTaskReceive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDronerId = async () => {
    setDronerId((await AsyncStorage.getItem('droner_id')) ?? '');
  };

  useEffect(() => {
    setData(data?.data?.filter((x: any) => x.item.id != actiontaskId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actiontaskId]);
  useEffect(() => {
    getDronerId();
  }, []);

  // const onTaskReceive = async () => {
  // const dronerId = await AsyncStorage.getItem('droner_id');
  // socket.on(`unsend-task-${dronerId!}`, (taskId: string) => {
  // if (data.find((x: any) => x.item.id == taskId)) {
  // setUnsendtask(data.concat(data))
  // setData(data.filter((x: any) => x.item.id != taskId));
  // }
  // });
  // };

  const disconnectSocket = async () => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    socket.removeAllListeners(`unsend-task-${dronerId!}`);
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
    if (!isDoneAuth && data?.data?.length < 1) {
      return () => (
        <View
          style={{
            paddingHorizontal: 8,
            paddingBottom: 8,
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
                        height: normalize(200),
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
        <View style={[{flex: 1}]}>
          {data?.data?.length == 0 &&
          !isOpenReceiveTask &&
          dronerStatus === 'ACTIVE' ? (
            <View
              style={[
                stylesCentral.center,
                {flex: 1, backgroundColor: colors.grayBg},
              ]}>
              <Image
                source={image.blankNewTask}
                style={{width: normalize(136), height: normalize(111)}}
              />
              <View
                style={{
                  marginTop: normalize(20),
                  paddingHorizontal: normalize(25),
                }}>
                <Text style={[stylesCentral.blankFont, {textAlign: 'center'}]}>
                  ยังไม่มีงานใหม่ เนื่องจากคุณปิดรับงานอยู่
                  กรุณากดเปิดรับงานเพื่อที่จะไม่พลาดงานสำหรับคุณ!
                </Text>
              </View>
            </View>
          ) : (
            dronerStatus === 'ACTIVE' && <View />
          )}
          {data?.data?.length == 0 &&
            isOpenReceiveTask &&
            dronerStatus === 'ACTIVE' && (
              <View
                style={[
                  stylesCentral.center,
                  {flex: 1, backgroundColor: colors.grayBg},
                ]}>
                <Image
                  source={image.blankNewTask}
                  style={{width: normalize(136), height: normalize(111)}}
                />
                <View
                  style={{
                    marginTop: normalize(20),
                    paddingHorizontal: normalize(40),
                  }}>
                  <Text style={stylesCentral.blankFont}>
                    โปรดรอเพื่อรับงานจากระบบ
                  </Text>
                </View>
              </View>
            )}

          {dronerStatus == 'PENDING' ? (
            <View
              style={{
                backgroundColor: colors.grayBg,
                flex: 1,
                justifyContent: 'flex-end',
              }}>
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
            <View
              style={{
                backgroundColor: colors.grayBg,
                flex: 1,
                justifyContent: 'flex-end',
              }}>
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
            <View
              style={{
                backgroundColor: colors.grayBg,
                flex: 1,
                justifyContent: 'flex-end',
              }}>
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
                      <Text style={styles.textButton}>เพิ่มข้อมูลโปรไฟล์</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
          {data?.data?.length > 0 && (
            <View
              style={{
                paddingTop: 8,
              }}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                onEndReached={onLoadMore}
                ListHeaderComponent={RenderWarningDoc}
                contentContainerStyle={{
                  paddingHorizontal: 8,
                  paddingTop: 8,
                  marginBottom: 8,
                }}
                keyExtractor={element => element.item.id}
                data={data.data}
                renderItem={({item}: any) => (
                  <NewTask
                    {...item.item}
                    taskId={item.item.id}
                    taskNo={item.item.taskNo}
                    status={item.item.status}
                    title={item.item.farmerPlot.plantName}
                    price={
                      parseInt(item.item.price) +
                      parseInt(item.item.revenuePromotion)
                    }
                    date={item.item.dateAppointment}
                    address={item.item.farmerPlot.locationName}
                    distance={
                      item.item.taskDronerTemp.find(
                        (x: any) => x.dronerId == dronerId,
                      ).distance
                    }
                    user={`${item.item.farmer.firstname} ${item.item.farmer.lastname}`}
                    img={item.image_profile_url}
                    preparation={item.item.preparationBy}
                    tel={item.item.farmer.telephoneNo}
                    updatedAt={item.item.updatedAt}
                    comment={item.item.comment}
                    // callFunc={handlePresentModalPress}
                    // setTel={setTelNum}
                    farmArea={item.item.farmAreaAmount}
                    receiveTask={() => {
                      setSelectedTaskId(item.item.id);
                      setOpenConfirmModal(true);
                    }}
                    fetchData={() => getData()}
                  />
                )}
              />
            </View>
          )}
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
                    mixpanel.track('accept task from new task list');
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
                      mixpanel.track('reject task from new task');
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
        </View>
      )}
    </NetworkLost>
  );
};
export default NewTaskScreen;

const styles = StyleSheet.create({
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
