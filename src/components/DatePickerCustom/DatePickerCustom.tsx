import moment from 'moment';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {colors, font} from '../../assets';
import Text from '../Text';
import {_monthName} from './date-constant';

const DatePickerCustom: React.FC<DatePickerProps> = ({
  value,
  onHandleChange,
  startDate = new Date(),
  height,
  width,
  fontSize,
  textColor,
  startYear,
  endYear,
  markColor,
  markHeight,
  markWidth,
  fadeColor,
  format,
}) => {
  const [days, setDays] = useState<any[]>([]);
  const [months, setMonths] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const changeHandle = (type: any, digit: any): void => {
    const newDate = moment(value);
    switch (type) {
      case 'day':
        newDate.set('date', digit);
        break;
      case 'month':
        newDate.set('month', digit - 1);
        break;
      case 'year':
        newDate.set('year', digit - 543);
        break;
    }
    onHandleChange(newDate.toISOString());
  };

  useEffect(() => {
    const getInitDate = () => {
      const end = endYear || new Date().getFullYear() + 543;
      const start = !startYear || startYear > end ? end - 76 : startYear;

      const _days = () => {
        const genDate = [...Array(moment(value).daysInMonth())].map(
          (_, index) => index + 1,
        );
        const isCurrentMonth = moment(value).isSame(startDate, 'month');
        if (isCurrentMonth) {
          const isDayBefore = moment(value).isBefore(startDate, 'day');
          const newDateList = genDate.filter(
            day => day >= startDate?.getDate(),
          );

          if (isDayBefore) {
            changeHandle('day', newDateList[0]);
          }
          return newDateList;
        }

        return genDate;
      };

      const _months = [...Array(12)]
        .map((_, i) => i + 1)
        .filter((_, i) => {
          if (
            moment(value).isSame(
              moment().set({
                year: startYear && startYear - 543,
              }),
              'year',
            )
          ) {
            return i >= startDate?.getMonth();
          }
          return true;
        });
      const _years = [...Array(end - start + 1)].map(
        (_, index) => start + index,
      );
      setDays(_days);
      setMonths(_months);
      setYears(_years);
    };
    getInitDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startYear, endYear, value]);

  const pickerHeight: number = Math.round(
    height || Dimensions.get('window').height / 3.5,
  );
  const pickerWidth: number | string = width || '100%';

  const unexpectedDate: Date = new Date(years[0], 0, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const date = new Date(value || unexpectedDate);

  // const date = new Date()
  const startMonth = moment(value).isSame(
    moment().set({
      year: startYear && startYear - 543,
    }),
    'year',
  )
    ? startDate?.getMonth()
    : 0;
  const getOrder = useMemo(() => {
    const getOrder = () => {
      return (format || 'dd-mm-yyyy').split('-').map((type, index: any) => {
        switch (type) {
          case 'dd':
            return {
              name: 'day',
              digits: days || [],
              value: date.getDay(),
              currentIndex: days.findIndex(el => el === date.getDate()),
            };
          case 'mm':
            return {
              name: 'month',
              digits: months || [],
              value: date.getMonth() + 1,

              currentIndex: months.findIndex(el => el === date.getMonth() + 1),
            };
          case 'yyyy':
            return {
              name: 'year',
              digits: years || [],
              value: date.getFullYear(),
              currentIndex: years.findIndex(
                el => el === date.getFullYear() + 543,
              ),
            };
          default:
            console.warn(
              `Invalid date picker format prop: found "${type}" in ${format}. Please read documentation!`,
            );
            return {
              name: ['day', 'month', 'year'][index],
              digits: [days, months, years][index],
              value: [date.getDate(), date.getMonth() + 1, date.getFullYear()][
                index
              ],
              currentIndex: 0,
            };
        }
      });
    };
    return getOrder;
  }, [days, months, years, date, format]);

  const isHaveData = days.length > 0 && months.length > 0 && years.length > 0;
  return (
    <View style={[styles.picker, {height: pickerHeight, width: pickerWidth}]}>
      {isHaveData &&
        getOrder().map((el, index) => {
          if (index == 2) {
            return (
              <DateBlock
                index={2}
                startMonth={startMonth}
                digits={el.digits}
                value={el.value}
                onHandleChange={changeHandle}
                height={pickerHeight}
                fontSize={fontSize}
                textColor={textColor}
                markColor={markColor}
                markHeight={markHeight}
                markWidth={markWidth}
                fadeColor={fadeColor}
                type={el.name}
                key={index}
                currentIndex={el.currentIndex}
              />
            );
          } else {
            return (
              <DateBlock
                currentIndex={el.currentIndex}
                index={index}
                digits={el.digits}
                value={el.value}
                startMonth={startMonth}
                onHandleChange={changeHandle}
                height={pickerHeight}
                fontSize={fontSize}
                textColor={textColor}
                markColor={markColor}
                markHeight={markHeight}
                markWidth={markWidth}
                fadeColor={fadeColor}
                type={el.name}
                key={index}
              />
            );
          }
        })}
    </View>
  );
};

const DateBlock: React.FC<DateBlockProps> = ({
  index,
  digits = [],
  type,
  startMonth = 0,
  onHandleChange,
  height,
  fontSize,
  textColor,
  markHeight,
  markWidth,
  currentIndex,
}) => {
  const dHeight: number = Math.round(height / 3.4);

  const mHeight: number = markHeight || Math.min(dHeight, 65);
  const offsets = digits.map((_: number, index: number) => index * dHeight);
  const scrollRef = useRef<any>(null);
  const snapScrollToIndex = (index: number) => {
    scrollRef?.current?.scrollTo({y: dHeight * index, animated: true});
  };
  useEffect(() => {
    setTimeout(() => {
      snapScrollToIndex(currentIndex);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMomentumScrollEnd = ({nativeEvent}: any) => {
    const digit = Math.round(nativeEvent.contentOffset.y / dHeight + digits[0]);
    onHandleChange(type, digit);
  };
  if (digits.length === 0) {
    return null;
  }
  return (
    <View style={styles.block}>
      <View
        style={[
          styles.mark,
          {
            top: (height - mHeight) / 2,
            height: mHeight,
            width: 130,
          },
        ]}
      />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        snapToOffsets={offsets}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={0}>
        {digits.map((value: any, valIndex: any) => {
          return (
            <TouchableOpacity
              key={valIndex}
              onPress={() => {
                onHandleChange(type, digits[valIndex]);
                snapScrollToIndex(valIndex);
              }}>
              <Text
                style={[
                  styles.digit,
                  {
                    fontSize: fontSize || 20,
                    color: textColor || '#000000',
                    opacity: currentIndex === valIndex ? 1 : 0.25,

                    marginBottom:
                      valIndex === digits.length - 1
                        ? height / 2 - dHeight / 2
                        : 0,
                    marginTop: valIndex === 0 ? height / 2 - dHeight / 2 : 0,
                    lineHeight: dHeight,
                    height: dHeight,
                    fontFamily: font.medium,
                  },
                ]}>
                {type !== 'month'
                  ? value
                  : _monthName.slice(startMonth, 12)[valIndex]
                  ? _monthName.slice(startMonth, 12)[valIndex].value
                  : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    flexDirection: 'row',
    width: '100%',
  },
  block: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  scroll: {
    width: '100%',
  },
  digit: {
    fontSize: 20,
    textAlign: 'center',
  },
  mark: {
    position: 'absolute',
    borderRadius: 10,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: colors.disable,
    borderTopColor: colors.disable,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
  },
});

export interface DatePickerProps {
  value: any;
  height?: number;
  width?: number | string;
  fontSize?: number;
  textColor?: string;
  startYear?: number;
  endYear?: number;
  markColor?: string;
  markHeight?: number;
  markWidth?: number | string;
  fadeColor?: string;
  format?: string;
  startDate?: Date;
  onHandleChange: (value: any) => void;
}

export interface DateBlockProps {
  index: number;
  digits: any[];
  value: any;
  type: string;
  height: number;
  startMonth?: number;
  fontSize?: number;
  textColor?: string;
  markColor?: string;
  markHeight?: number;
  markWidth?: number | string;
  fadeColor?: string;
  onHandleChange(type: any, digit: any): void;
  currentIndex: number;
}

export default DatePickerCustom;
