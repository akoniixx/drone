import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {stylesCentral} from '../../styles/StylesCentral';
import {colors, font, icons, image} from '../../assets';
import {normalize} from '../../function/Normalize';
import {responsiveHeigth, responsiveWidth} from '../../function/responsive';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import * as RootNavigation from '../../navigations/RootNavigation';
import {FCMtokenDatasource} from '../../datasource/FCMDatasource';
import fonts from '../../assets/fonts';
import {MainButton} from '../../components/Button/MainButton';
import {useFocusEffect} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';

interface NotificationListTileParams {
  type: string;
  date: string;
  description: string;
  isRead: boolean;
  id: string;
  data: any;
}

const monthArray = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

const deleteItem = (id: string) => {
  FCMtokenDatasource.deleteNotiItem(id)
    .then(res => {
      RootNavigation.navigate('Main', {
        screen: 'MainScreen',
      });
    })
    .catch(err => console.log(err));
};

const generateNotiTime = (date: string, time: string) => {
  const datenow = new Date();
  const datesplit = date.split('-');
  if (
    parseInt(datesplit[2]) === datenow.getDate() &&
    parseInt(datesplit[1]) === datenow.getMonth() + 1
  ) {
    return `${parseInt(time.split(':')[0]) + 7}:${time.split(':')[1]}`;
  } else {
    return `${datesplit[2]} ${monthArray[parseInt(datesplit[1]) - 1]}`;
  }
};

const readIt = (id: string) => {
  FCMtokenDatasource.readNotification(id)
    .then(res => {
      RootNavigation.navigate('Main', {
        screen: 'MainScreen',
      });
    })
    .catch(err => console.log(err));
};

const readItTask = (id: string, data: string) => {
  FCMtokenDatasource.readNotification(id)
    .then(res => {
      RootNavigation.navigate('Main', {
        screen: 'TaskDetailScreen',
        params: {taskId: data},
      });
    })
    .catch(err => console.log(err));
};

const NotificationListTile: React.FC<NotificationListTileParams> = ({
  type,
  date,
  description,
  isRead,
  id,
  data,
}) => {
  const currentdate = date.split('T')[0];
  const currentTime = date.split('T')[1];
  const translateX = useSharedValue(0);

  const rStyle = useAnimatedStyle(()=>({
    transform : [
      {
        translateX : translateX.value
      }
    ]
  }))

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive : (event) =>{
      translateX.value = event.translationX
    },
    onEnd : () => {
      
    }
  })

  if (
    type === 'APPROVE_DRONER_SUCCESS' ||
    type === 'APPROVE_DRONER_FAIL' ||
    type === 'APPROVE_DRONER_DRONE_SUCCESS' ||
    type === 'APPROVE_DRONER_DRONE_FAIL' ||
    type === 'APPROVE_ADDITION_DRONER_DRONE_SUCCESS' ||
    type === 'APPROVE_ADDITION_DRONER_DRONE_FAIL'
  ) {
    return (
      <Pressable onPress={()=>{
        readIt(id)
      }} style={{
          height: responsiveHeigth(78),
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          borderBottomWidth: normalize(1),
          borderBottomColor: colors.disable,
          backgroundColor: colors.white,
        }}>
      <Image
        source={icons.notificationsetup}
        style={{
          width: normalize(50),
          height: normalize(50),
        }}
      />
      <View
        style={{
          width: '65%',
        }}>
            <Text numberOfLines={2} ellipsizeMode='tail'style={{
              fontFamily : font.medium,
              color : colors.fontBlack
            }}>{description}</Text>
          </View>
          <View style={{
        justifyContent : 'space-between',
        alignItems : 'flex-end',
        paddingRight : normalize(10)
      }}>
          {
            isRead ?
            <View style={{
              width : normalize(8),
              height : normalize(8),
              marginBottom : normalize(10)
            }} ></View>:
            <Image source={icons.unread} style={{
              width : normalize(8),
              height : normalize(8),
              marginBottom : normalize(10)
            }} />
          }
          <Text style={{
            fontFamily : font.light,
            color : colors.gray
          }}>{generateNotiTime(currentdate,currentTime)}</Text>
        </View>
      </Pressable>
        );
      } else if (
    type === 'FIRST_REMIND' ||
    type === 'SECOND_REMIND' ||
    type === 'THIRD_REMIND' ||
    type === 'FORTH_REMIND' ||
    type === 'DONE_TASK_REMIND' ||
    type === 'FORCE_SELECT_DRONER' ||
    type === 'RECEIVE_TASK_SUCCESS'
  ) {
    return (
      <Pressable onPress={()=>{
        readItTask(id,data.id)
      }} style={{
        height: responsiveHeigth(78),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: normalize(1),
        borderBottomColor: colors.disable,
        backgroundColor: colors.white,
        zIndex : 1000
      }}>
        <Image
          source={icons.notificationtask}
          style={{
            width: normalize(50),
            height: normalize(50),
          }}
        />
        <View
          style={{
            width: '65%',
          }}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontFamily: font.medium,
              color: colors.fontBlack,
            }}>
            {description}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingRight: normalize(10),
          }}>
          {isRead ? (
            <View
              style={{
                width: normalize(8),
                height: normalize(8),
                marginBottom: normalize(10),
              }}
            />
          ) : (
            <Image
              source={icons.unread}
              style={{
                width: normalize(8),
                height: normalize(8),
                marginBottom: normalize(10),
              }}
            />
          )}
          <Text
            style={{
              fontFamily: font.light,
              color: colors.gray,
            }}>
            {generateNotiTime(currentdate, currentTime)}
          </Text>
        </View>
      </Pressable>
    );
  } else {
    return <></>;
  }
};

const NotificationList: React.FC<any> = ({navigation, route}) => {
  const [data, setData] = useState([]);
  const [loading,setLoading] = useState(true);
  const [deleteall, setDeleteall] = useState(false);
  const getNotiList = () => {
    FCMtokenDatasource.getNotificationList()
      .then(res => {
        setLoading(false);
        setData(res.data);
      })
      .catch(err => console.log(err));
  };
  const deleteAllItem = () => {
    FCMtokenDatasource.deleteNotiAllItem()
      .then(res => {
        setDeleteall(false);
        RootNavigation.navigate('Main', {
          screen: 'MainScreen',
        });
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    getNotiList();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      getNotiList();
    }, []),
  );
  return (
    <SafeAreaView style={[stylesCentral.container]}>
      <Modal transparent={true} visible={deleteall}>
        <View style={styles.modal}>
          <View style={styles.modalBg}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: normalize(18),
                  color: colors.fontBlack,
                }}>
                ต้องการลบข้อความทั้งหมด
              </Text>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: normalize(18),
                  color: colors.fontBlack,
                }}>
                ออกจากกล่องข้อความ?
              </Text>
            </View>
            <MainButton
              label="ยกเลิก"
              color={colors.white}
              fontColor={colors.fontBlack}
              borderColor={colors.fontBlack}
              style={{
                marginVertical: normalize(5),
              }}
              onPress={() => {
                setDeleteall(false);
              }}
            />
            <MainButton
              label="ยืนยัน"
              color={colors.orange}
              fontColor={colors.white}
              style={{
                marginVertical: normalize(5),
              }}
              onPress={deleteAllItem}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.appBarBack}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.arrowLeft} style={styles.listTileIcon} />
        </TouchableOpacity>
        <Text style={[styles.appBarHeader]}>การแจ้งเตือน</Text>
        <View style={styles.listTileIcon}>
          <TouchableOpacity
            onPress={() => {
              setDeleteall(true);
            }}>
            <Image source={icons.deleteblack} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.body}>
        {
          (loading)?
          <Spinner
            visible={true}
            textContent={'Loading...'}
            textStyle={{color: '#FFF'}}
          />:
          (data.length != 0)?
          <SwipeListView
            data={data}
            rightOpenValue={-75}
            renderItem={({item}: any) => (
              <NotificationListTile
                type={item.type}
                date={item.createdAt}
                description={item.detail}
                isRead={item.isRead}
                id={item.id}
                data={item.data}
              />
            )}
            renderHiddenItem={(item : any , rowMap : any)=> (
              <Pressable
              onPress={() => {
                deleteItem(item.item.id)
              }}>
              <View
                style={{
                  width: responsiveHeigth(78),
                  height: responsiveHeigth(78),
                  backgroundColor: '#E85737',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position : 'absolute',
                  right : 0
                }}>
                <Image source={icons.deletewhite} />
              </View>
            </Pressable>
            )}
          />:
          <View style={{
            paddingTop : '50%',
            justifyContent : 'center',
            alignItems : 'center'
          }}>
            <Image source={image.emptyhistory}/>
            <Text style={{
              fontFamily : font.medium,
              color : colors.grayPlaceholder,
              fontSize : normalize(15),
              paddingTop : normalize(10)
            }}>ยังไม่มีข้อความในขณะนี้</Text>
            <Text style={{
              fontFamily : font.medium,
              color : colors.grayPlaceholder,
              fontSize : normalize(15)
            }}>เมื่อคุณได้รับข้อความใหม่ กลับมาดูได้ที่นี้</Text>
          </View>
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  appBarHeader: {
    fontFamily: font.bold,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  appBarBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(12),
    alignItems: 'center',
  },
  listTileIcon: {
    width: normalize(24),
    height: normalize(24),
  },
  body: {
    flex: 9,
    paddingTop: normalize(10),
    paddingHorizontal: normalize(17),
    color: colors.fontBlack,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBg: {
    width: responsiveWidth(345),
    borderRadius: responsiveWidth(16),
    backgroundColor: colors.white,
    paddingVertical: responsiveHeigth(15),
    paddingHorizontal: normalize(20),
  },
});
export default NotificationList;