import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  NativeScrollEvent,
  Image,
} from 'react-native';
import React from 'react';
import fonts from '../../assets/fonts';
import {normalize} from '../../function/Normalize';
import colors from '../../assets/colors/colors';
import dayjs from 'dayjs';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {
  calTotalPrice,
  momentExtend,
  numberWithCommas,
} from '../../function/utility';
import Divider from '../../components/Divider';
import image from '../../assets/images/image';
import {stylesCentral} from '../../styles/StylesCentral';
import {DataType} from '.';
import {checkDecimal} from '../../function/checkDecimal';
import Text from '../../components/Text';
import {mixpanel} from '../../../mixpanel';

interface Styles {
  isFocus?: boolean;
}
interface Props {
  setType: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  setData: React.Dispatch<React.SetStateAction<DataType[]>>;
  data: DataType[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total: number;
  page: number;
}

export default function ContentList({
  setType,
  type,
  setData,
  data,
  setPage,
  total,
  page,
}: Props): JSX.Element {
  const listHeader = [
    {
      title: 'สัปดาห์นี้',
      type: 'week',
    },
    {
      title: 'เดือนนี้',
      type: 'month',
    },
    {
      title: '3 เดือน',
      type: '3month',
    },
  ];

  const onLoadMore = async () => {
    try {
      if (data.length < total) {
        const currentStartOfWeek = dayjs().startOf('week').toISOString();
        const currentEndOfWeek = dayjs().endOf('week').toISOString();
        const currentStartOfMonth = dayjs().startOf('month').toISOString();
        const currentEndOfMonth = dayjs().endOf('month').toISOString();
        const currentStartOf3Month = dayjs()
          .subtract(3, 'month')
          .startOf('month')
          .toISOString();
        const currentEndOf3Month = dayjs().endOf('month').toISOString();
        const result = await ProfileDatasource.getListTaskInProgress({
          start:
            type === 'week'
              ? currentStartOfWeek
              : type === 'month'
              ? currentStartOfMonth
              : currentStartOf3Month,
          end:
            type === 'week'
              ? currentEndOfWeek
              : type === 'month'
              ? currentEndOfMonth
              : currentEndOf3Month,
          page: page + 1,
        });
        setPage(prev => prev + 1);
        setData([...data, ...result.data]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  return (
    <>
      <View style={styles({}).header}>
        {listHeader.map((item, index) => {
          const isFocus = item.type === type;

          return (
            <TouchableOpacity
              key={index}
              style={styles({isFocus}).buttonHeader}
              onPress={() => {
                setType(item.type);
                setPage(1);
                mixpanel.track('IncomeScreen_TabView_ChangeTab', {
                  tab: item.title,
                });
              }}>
              <Text style={styles({isFocus}).textHeader}>{item.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {data.length > 0 ? (
        <ScrollView
          scrollEventThrottle={400}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              onLoadMore();
            }
          }}>
          {data.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  marginBottom: 8,
                  height: 120,
                  paddingHorizontal: 16,
                }}>
                <Text style={styles({}).textTitle}>
                  {`${momentExtend.toBuddhistYear(
                    item.dateAppointment,
                    'DD MMM YYYY',
                  )}`}
                </Text>

                <View style={{paddingVertical: 8}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={[styles({}).text, {width: '70%'}]}
                      numberOfLines={1}>
                      {`${
                        item?.purposeSpray?.purposeSprayName
                          ? item?.purposeSpray.purposeSprayName
                          : ''
                      } (${item?.farmerPlot?.plantName}) (${checkDecimal(
                        +item?.farmAreaAmount,
                      )} ไร่)`}
                    </Text>
                    <Text style={styles({}).textMoney}>
                      ฿
                      {numberWithCommas(
                        calTotalPrice(item.price, item.revenuePromotion),
                        true,
                      )}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles({}).textSmall,
                      {
                        marginTop: 8,
                      },
                    ]}>
                    {dayjs(item.dateAppointment).format('HH:mm')} น.
                  </Text>
                  <Divider />
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View
          style={[
            stylesCentral.center,
            {flex: 1, backgroundColor: colors.grayBg, padding: 8},
          ]}>
          <Image
            source={image.blankIncome}
            style={{
              width: normalize(136),
              height: normalize(136),
              marginBottom: 16,
            }}
          />
          <Text style={stylesCentral.blankFont}>
            คุณยังไม่มีรายได้จากการบินโดรน
          </Text>
          <Text style={stylesCentral.blankFont}>
            เปิดรับงานและเริ่มทำงานได้เลย!
          </Text>
        </View>
      )}
    </>
    // <FlatList
    //   data={data}
    //   stickyHeaderIndices={[0]}
    //   ListHeaderComponent={
    //     <View style={styles({}).header}>
    //       {listHeader.map((item, index) => {
    //         const isFocus = item.type === type;

    //         return (
    //           <TouchableOpacity
    //             key={index}
    //             style={styles({isFocus}).buttonHeader}
    //             onPress={() => setType(item.type)}>
    //             <Text style={styles({isFocus}).textHeader}>{item.title}</Text>
    //           </TouchableOpacity>
    //         );
    //       })}
    //     </View>
    //   }
    //   contentContainerStyle={{
    //     paddingHorizontal: 16,
    //   }}
    //   ListEmptyComponent={
    //     <View
    //       style={{
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         marginTop: 32,
    //       }}>
    //       <Text style={styles({}).textTitle}>ไม่มีรายการ</Text>
    //     </View>
    //   }

    //   keyExtractor={(item, index) => index.toString()}
    // />
  );
}

const styles = ({isFocus = false}: Styles) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 8,
      backgroundColor: colors.white,
    },
    buttonHeader: {
      paddingVertical: 8,
      paddingHorizontal: 32,

      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isFocus ? colors.orange : 'transparent',
    },
    textHeader: {
      fontFamily: fonts.medium,
      fontSize: normalize(16),
      color: isFocus ? colors.white : colors.gray,
    },
    textTitle: {
      fontFamily: fonts.medium,
      fontSize: normalize(16),
      color: colors.fontBlack,
    },
    text: {
      fontFamily: fonts.medium,
      fontSize: normalize(16),
      color: colors.fontBlack,
    },
    textMoney: {
      fontFamily: fonts.medium,
      fontSize: normalize(16),
      color: colors.greenDark,
    },
    textSmall: {
      fontFamily: fonts.regular,
      fontSize: normalize(14),
      color: colors.gray,
    },
  });
