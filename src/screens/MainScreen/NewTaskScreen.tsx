import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {normalize} from '@rneui/themed';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {colors, font, image} from '../../assets';
import {TaskDatasource} from '../../datasource/TaskDatasource';
import {stylesCentral} from '../../styles/StylesCentral';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import NewTask from '../../components/TaskList/NewTask';
import Toast from 'react-native-toast-message';
import icons from '../../assets/icons/icons';
import fonts from '../../assets/fonts';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {socket} from '../../function/utility';
import {ActionContext} from '../../../App';

interface Prop {
  isOpenReceiveTask: boolean;
  dronerStatus: string;
}

const NewTaskScreen: React.FC<Prop> = (props: Prop) => {
  const [unsendTask, setUnsendtask] = useState([]);
  const dronerStatus = props.dronerStatus;
  const {isOpenReceiveTask} = props;
  const [data, setData] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [checkResIsComplete, setCheckResIsComplete] = useState(false);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const snapPoints = useMemo(() => ['25%', '25%'], []);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const width = Dimensions.get('window').width;
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [dronerId, setDronerId] = useState<string>('');
  const {actiontaskId, setActiontaskId} = useContext(ActionContext);

  const getData = async () => {
    setLoading(true);
    const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.getTaskById(dronerId, ['WAIT_RECEIVE'], 1, 999)
      .then(res => {
        if (res !== undefined) {
          setData(res);
          setCheckResIsComplete(true);
          setLoading(false);
        }
      })
      .catch(err => console.log(err));
  };
  const receiveTask = async () => {
    const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.receiveTask(selectedTaskId, dronerId, true)
      .then(res => {
        if (res.success) {
          const task = res.responseData.data;
          setData(data.filter((x: any) => x.item.id != task.id));
          Toast.show({
            type: 'receiveTaskSuccess',
            text1: `งาน #${task.taskNo}`,
            text2: `วันที่ ${
              data.dateAppointment.split('T')[0].split('-')[2]
            }/${data.dateAppointment.split('T')[0].split('-')[1]}/${
              parseInt(data.dateAppointment.split('T')[0].split('-')[0]) + 543
            } เวลา ${
              parseInt(data.dateAppointment.split('T')[1].split(':')[0]) + 7 > 9
                ? `${
                    parseInt(data.dateAppointment.split('T')[1].split(':')[0]) +
                    7
                  }`
                : `0${
                    parseInt(data.dateAppointment.split('T')[1].split(':')[0]) +
                    7
                  }`
            }:${data.dateAppointment.split('T')[1].split(':')[1]}`,
            onPress: () => {
              Toast.hide();
            },
          });
        } else {
          getData();
          setData(data.filter((x: any) => x.item.id != selectedTaskId));
        }
      })
      .catch(err => console.log(err));
  };
  const rejectTask = async () => {
    const dronerId = (await AsyncStorage.getItem('droner_id')) ?? '';
    TaskDatasource.receiveTask(selectedTaskId, dronerId, false)
      .then(res => {
        setData(data.filter((x: any) => x.item.id != selectedTaskId));
      })
      .catch(err => console.log(err));
  };
  useFocusEffect(
    React.useCallback(() => {
      getData();
      return () => disconnectSocket();
    }, []),
  );

  useEffect(() => {
    onNewTask();
    onTaskReceive();
  }, [data]);

  const getDronerId = async () => {
    setDronerId((await AsyncStorage.getItem('droner_id')) ?? '');
  };

  useEffect(() => {
    setData(data.filter((x: any) => x.item.id != actiontaskId));
  }, [actiontaskId]);
  useEffect(() => {
    getDronerId();
  }, []);

  const onNewTask = async () => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    socket.on(`send-task-${dronerId!}`, task => {
      setData(
        [{image_profile_url: task.image_profile_url, item: task.data}].concat(
          data.filter((x: any) => x.item.id != task.data.id),
        ),
      );
    });
  };

  const onTaskReceive = async () => {
    // const dronerId = await AsyncStorage.getItem('droner_id');
    // socket.on(`unsend-task-${dronerId!}`, (taskId: string) => {
    // if (data.find((x: any) => x.item.id == taskId)) {
    // setUnsendtask(data.concat(data))
    // setData(data.filter((x: any) => x.item.id != taskId));
    // }
    // });
  };

  const disconnectSocket = async () => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    socket.removeAllListeners(`unsend-task-${dronerId!}`);
  };

  return (
    <>
      <View style={[{flex: 1, backgroundColor: colors.grayBg, padding: 8}]}>
        {data.length == 0 && !isOpenReceiveTask && dronerStatus === 'ACTIVE' && (
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
        )}
        {data.length == 0 && isOpenReceiveTask && dronerStatus === 'ACTIVE' && (
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
                style={{paddingBottom: normalize(20), marginTop: normalize(5)}}>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: normalize(18),
                    color: 'black',
                  }}>
                  เจ้าหน้าที่กำลังตรวจสอบเอกสารการยืนยันตัวตน และ โดรนของคุณอยู่
                  กรุณาตรวจสอบหากคุณยังไม่เพิ่มโดรน
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
                style={{paddingBottom: normalize(20), marginTop: normalize(5)}}>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: normalize(18),
                    color: 'black',
                  }}>
                  โปรดติดต่อเจ้าหน้าที่ เพื่อดำเนินการแก้ไข โทร. 021136159
                </Text>
              </View>
            </View>
          </View>
        ) : null}
        {data.length > 0 && (
          <View>
            <FlatList
              keyExtractor={element => element.item.id}
              data={data}
              renderItem={({item}: any) => (
                <NewTask
                  taskId={item.item.id}
                  taskNo={item.item.taskNo}
                  status={item.item.status}
                  title={item.item.farmerPlot.plantName}
                  price={item.item.totalPrice}
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
                    color : colors.fontBlack
                  }}>
                  ไม่รับงาน
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={{color: '#FFF'}}
      />
    </>
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
    fontFamily: font.light,
    fontSize: normalize(14),
    color: colors.gray,
  },
});
