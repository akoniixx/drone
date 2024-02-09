import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {colors, font, icons} from '../../assets';
import Text from '../Text';
import RadioList from '../RadioList';
import {normalize} from '../../function/Normalize';
import AsyncButton from '../Button/AsyncButton';

const sortFields = [
  {
    value: 'dateAppointment',
    label: 'งานที่ใกล้ถึง',
    sortDirection: 'DESC',
  },
  {
    value: 'createdAt',
    label: 'งานใหม่ล่าสุด',
    sortDirection: 'DESC',
  },
  {
    value: 'price',
    label: 'ค่าบริการต่ำ - สูง',
    sortDirection: 'ASC',
  },
  {
    value: 'price',
    label: 'ค่าบริการสูง - ต่ำ',
    sortDirection: 'DESC',
  },
];
export const ListStatusTaskNormal = [
  {
    id: '1',
    label: 'งานปกติ',
    value: 'NORMAL_INPROGRESS',
  },
];
export const StatusListExtend = [
  {
    id: '1',
    label: 'รอขยายเวลา',
    value: 'WAIT_APPROVE',
  },
  {
    id: '2',
    label: 'อนุมัติขยายเวลา',
    value: 'APPROVED',
  },
  {
    id: '3',
    label: 'ไม่อนุมัติขยายเวลา',
    value: 'REJECTED',
  },
];
export const StatusFinish = [
  {
    id: '1',
    label: 'รอรีวิว',
    value: 'WAIT_REVIEW',
  },
  {
    id: '2',
    label: 'งานเสร็จสิ้น',
    value: 'DONE',
  },
  {
    id: '3',
    label: 'ถูกยกเลิก',
    value: 'CANCELED',
  },
];
export const StatusPayment = [
  {
    id: '1',
    label: 'รอรับเงิน',
    value: 'WAIT_PAYMENT',
  },
  {
    id: '2',
    label: 'รับเงินแล้ว',
    value: 'DONE_PAYMENT',
  },
];
export interface CurrentFilterType {
  sortByField: {
    value: string;
    label: string;
    sortDirection: string;
  };
  listStatus: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  paymentStatus: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  taskStatusNormal: Array<{
    id: string;
    label: string;
    value: string;
  }>;
}

interface PayloadSheetType {
  currentTab: {
    key: string;
    title: string;
  };
  currentFilter: CurrentFilterType;
}

export default function SheetFilterTask(props: SheetProps) {
  const [currentFilter, setCurrentFilter] = useState<CurrentFilterType>({
    listStatus: [],
    sortByField: sortFields[0],
    paymentStatus: [],
    taskStatusNormal: [],
  } as CurrentFilterType);
  const payload: PayloadSheetType = props.payload;
  const [heightAnim] = React.useState(new Animated.Value(0));

  const onPressSortByField = (item: {
    value: string;
    label: string;
    sortDirection: string;
  }) => {
    setCurrentFilter(prev => ({
      ...prev,
      sortByField: item,
    }));
  };

  useEffect(() => {
    if (payload.currentFilter) {
      setCurrentFilter(payload.currentFilter);
    }
  }, [payload.currentFilter]);

  const listStatus = useMemo(() => {
    if (payload.currentTab.key === 'inprogress') {
      return StatusListExtend;
    }
    if (payload.currentTab.key === 'finish') {
      return StatusFinish;
    }
    return [];
  }, [payload.currentTab]);
  const onPressSelectStatus = (item: {
    id: string;
    label: string;
    value: string;
  }) => {
    const isExist = currentFilter?.listStatus?.find(el => {
      return el.value === item.value;
    });

    if (isExist) {
      setCurrentFilter({
        ...currentFilter,
        listStatus: currentFilter?.listStatus?.filter(el => {
          return el.value !== item.value;
        }),
      });
    } else {
      if (item.value === 'DONE') {
        setCurrentFilter({
          ...currentFilter,
          listStatus: [...currentFilter?.listStatus, item],
          paymentStatus: StatusPayment,
        });
        return;
      }
      setCurrentFilter({
        ...currentFilter,
        listStatus: [...currentFilter?.listStatus, item],
      });
    }
  };
  const onPressSelectNormalStatus = (item: {
    id: string;
    label: string;
    value: string;
  }) => {
    const isExist = currentFilter?.taskStatusNormal?.find(el => {
      return el.value === item.value;
    });
    if (isExist) {
      setCurrentFilter({
        ...currentFilter,
        taskStatusNormal: currentFilter?.taskStatusNormal?.filter(el => {
          return el.value !== item.value;
        }),
      });
    } else {
      setCurrentFilter({
        ...currentFilter,
        taskStatusNormal: [...currentFilter?.taskStatusNormal, item],
      });
    }
  };

  const onPressSelectStatusPayment = (item: {
    id: string;
    label: string;
    value: string;
  }) => {
    const isExist = currentFilter?.paymentStatus?.find(el => {
      return el.value === item.value;
    });
    if (isExist) {
      setCurrentFilter({
        ...currentFilter,
        paymentStatus: currentFilter?.paymentStatus?.filter(el => {
          return el.value !== item.value;
        }),
      });
    } else {
      setCurrentFilter({
        ...currentFilter,
        paymentStatus: [...currentFilter?.paymentStatus, item],
      });
    }
  };
  const onPressConfirm = async () => {
    await SheetManager.hide(props.sheetId, {
      payload: {
        currentFilter,
      },
    });
  };

  const initialFilter = useMemo(() => {
    if (!payload.currentTab) {
      return [];
    }
    let listStatus: PayloadSheetType['currentFilter']['listStatus'] = [];
    let paymentStatus: PayloadSheetType['currentFilter']['paymentStatus'] = [];
    let taskStatusNormal: PayloadSheetType['currentFilter']['taskStatusNormal'] =
      [];
    if (payload.currentTab.key === 'inprogress') {
      listStatus = StatusListExtend;
      taskStatusNormal = ListStatusTaskNormal;
    }
    if (payload.currentTab.key === 'finish') {
      listStatus = StatusFinish;
      paymentStatus = StatusPayment;
      taskStatusNormal = [];
    }
    return {
      sortByField: {
        label: 'งานที่ใกล้ถึง',
        sortDirection: 'DESC',
        value: 'dateAppointment',
      },
      listStatus,
      paymentStatus,
      taskStatusNormal,
    };
  }, [payload.currentTab]);

  const isDisabled = useMemo(() => {
    let isDisabled = false;
    switch (payload.currentTab.key) {
      case 'inprogress':
        isDisabled =
          currentFilter?.listStatus?.length < 1 &&
          currentFilter?.taskStatusNormal?.length < 1;
        break;
      case 'finish':
        isDisabled = currentFilter?.listStatus?.length < 1;
        break;
      default:
        break;
    }
    return isDisabled;
  }, [currentFilter, payload.currentTab]);

  const isShowPaymentStatus = useMemo(() => {
    if (currentFilter.listStatus.length > 0) {
      const isHaveDoneStatus = currentFilter.listStatus.find(el => {
        return el.value === 'DONE';
      });
      if (isHaveDoneStatus) {
        return true;
      }
      return false;
    }
    return false;
  }, [currentFilter.listStatus]);

  React.useEffect(() => {
    if (isShowPaymentStatus) {
      Animated.timing(heightAnim, {
        toValue: 120,
        duration: 500,
        useNativeDriver: false, // height does not support native driver
      }).start();
    } else {
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowPaymentStatus]);

  const onPressReset = () => {
    setCurrentFilter(initialFilter as CurrentFilterType);
  };
  const onCloseSheet = () => {
    if (isDisabled) {
      return;
    }
    SheetManager.hide(props.sheetId);
  };

  return (
    <ActionSheet
      safeAreaInsets={{bottom: 0, top: 0, left: 0, right: 0}}
      useBottomSafeAreaPadding={false}
      onClose={onCloseSheet}
      closeOnTouchBackdrop={!isDisabled}
      id={props.sheetId}
      containerStyle={{
        height: '75%',
      }}>
      <View style={styles().container}>
        <View style={styles().row}>
          <Text
            style={{
              fontFamily: font.semiBold,
              fontSize: 20,
            }}>
            ตัวกรอง
          </Text>
          <TouchableOpacity onPress={onCloseSheet}>
            <Image
              source={icons.closeBlack}
              style={{
                width: 16,
                height: 16,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles().title}>
          <Text style={styles().textTitle}>เรียงลำดับงาน</Text>
        </View>
        <FlatList
          data={sortFields}
          style={{
            width: '100%',
          }}
          keyExtractor={(item, idx) => `${item.value}-${idx}`}
          renderItem={({item, index}) => {
            const isLast = index === sortFields.length - 1;
            return (
              <TouchableOpacity
                style={[
                  styles().list,
                  {
                    borderBottomWidth: isLast ? 0 : 1,
                  },
                ]}
                onPress={() => {
                  onPressSortByField(item);
                }}>
                <Text>{item.label}</Text>
                <RadioList
                  label={null}
                  onlyRadio
                  isSelected={currentFilter?.sortByField?.label === item.label}
                />
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            payload.currentTab.key !== 'waitStart' ? (
              <View style={{width: '100%'}}>
                <View style={styles().title}>
                  <Text style={styles().textTitle}>สถานะงาน</Text>
                </View>
                {payload.currentTab.key === 'inprogress' && (
                  <View
                    style={{
                      marginTop: 12,
                      paddingHorizontal: 16,
                      marginBottom: 4,
                    }}>
                    {ListStatusTaskNormal.map((item, index) => {
                      const isSelected = currentFilter?.taskStatusNormal?.find(
                        el => {
                          return el.value === item.value;
                        },
                      );
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            onPressSelectNormalStatus(item);
                          }}
                          style={[
                            styles().card,
                            {
                              borderWidth: 1.5,
                              borderColor: isSelected
                                ? colors.orange
                                : colors.greyWhite,
                              backgroundColor: isSelected
                                ? colors.orangeSoft
                                : colors.greyWhite,
                              alignSelf: 'flex-start',
                            },
                          ]}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: isSelected
                                ? colors.darkOrange2
                                : colors.fontBlack,
                              fontFamily: font.medium,
                            }}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                {payload.currentTab.key === 'inprogress' && (
                  <View
                    style={{
                      marginTop: 8,
                      paddingHorizontal: 16,
                    }}>
                    <Text
                      style={{
                        color: colors.gray,
                        fontSize: 12,
                        fontFamily: font.semiBold,
                      }}>
                      ขยายเวลา
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    paddingHorizontal: 16,
                    marginBottom: 8,
                  }}>
                  {listStatus.map((item, index) => {
                    const isSelected = currentFilter?.listStatus?.find(el => {
                      return el.value === item.value;
                    });
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          onPressSelectStatus(item);
                        }}
                        style={[
                          styles().card,
                          {
                            borderWidth: 1.5,
                            borderColor: isSelected
                              ? colors.orange
                              : colors.greyWhite,
                            backgroundColor: isSelected
                              ? colors.orangeSoft
                              : colors.greyWhite,
                          },
                        ]}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: isSelected
                              ? colors.darkOrange2
                              : colors.fontBlack,
                            fontFamily: font.medium,
                          }}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Animated.View
                  style={{
                    height: heightAnim, // Bind height to animated value
                    overflow: 'hidden', // Hide content when container collapses
                    width: '100%',
                  }}>
                  <View
                    style={{
                      marginTop: 8,
                      paddingHorizontal: 16,
                    }}>
                    <Text
                      style={{
                        color: colors.gray,
                        fontSize: 12,
                        fontFamily: font.semiBold,
                      }}>
                      รับรายได้จากบริษัท
                    </Text>
                  </View>
                  <View
                    style={{
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      paddingHorizontal: 16,
                    }}>
                    {StatusPayment.map((item, index) => {
                      const isSelected = currentFilter?.paymentStatus?.find(
                        el => {
                          return el.value === item.value;
                        },
                      );
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            onPressSelectStatusPayment(item);
                          }}
                          style={[
                            styles().card,
                            {
                              borderWidth: 1.5,
                              borderColor: isSelected
                                ? colors.orange
                                : colors.greyWhite,
                              backgroundColor: isSelected
                                ? colors.orangeSoft
                                : colors.greyWhite,
                            },
                          ]}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: isSelected
                                ? colors.darkOrange2
                                : colors.fontBlack,
                              fontFamily: font.medium,
                            }}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </Animated.View>
              </View>
            ) : (
              <></>
            )
          }
        />
      </View>
      <View
        style={[
          styles().footer,
          {
            paddingHorizontal: 16,
            borderBottomWidth: 0,
          },
        ]}>
        <AsyncButton
          onPress={onPressReset}
          title="คืนค่าเริ่มต้น"
          type="secondary"
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
          onPress={onPressConfirm}
          title="ตกลง"
          disabled={isDisabled}
          style={{
            flex: 1,
          }}
        />
      </View>
    </ActionSheet>
  );
}
const styles = () =>
  StyleSheet.create({
    container: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
      flex: 1,
      backgroundColor: colors.white,
    },
    footer: {
      paddingVertical: 16,
      backgroundColor: colors.white,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 32,
    },
    row: {
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderColor: colors.disable,
      paddingBottom: 12,
    },

    title: {
      width: '100%',
      backgroundColor: colors.transSubOrange,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    textTitle: {
      fontSize: 14,
      fontFamily: font.semiBold,
      color: colors.fontBlack,
    },
    list: {
      width: '100%',
      paddingVertical: 16,
      minHeight: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderColor: colors.disable,
      marginLeft: 16,
    },

    card: {
      width: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: normalize(10),
      borderRadius: 6,
      marginRight: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
  });
