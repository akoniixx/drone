import {Animated, Easing, StyleSheet, View} from 'react-native';
import React, {useEffect, useMemo, useRef} from 'react';
import CardFarmer from '../../components/CardFarmer/CardFarmer';
import {FarmerResponse} from '../../entities/FarmerInterface';
import {colors, font} from '../../assets';
import RadioList from '../../components/RadioList';
import {InputData} from '.';
import TextInputArea from '../../components/TextInputArea/TextInputArea';
import {mixValidator} from '../../function/inputValidate';
import Text from '../../components/Text';
import {normalize} from '../../function/Normalize';

type Props = {
  farmer: FarmerResponse;
  setTaskData: React.Dispatch<React.SetStateAction<InputData>>;
  taskData: InputData;
};

export const listData = [
  {
    id: '1',
    label: 'เกษตรกรเตรียมยาเอง',
    value: 'เกษตรกรเตรียมยาเอง',
  },
  {
    id: '2',
    label: 'นักบินโดรนเตรียมให้',
    value: 'นักบินโดรนเตรียมให้',
  },
];
const StepTwo = ({farmer, setTaskData, taskData}: Props) => {
  const [selected, setSelected] = React.useState<{
    id: string;
    label: string;
    value: string;
  }>({
    id: '1',
    label: 'เกษตรกรเตรียมยาเอง',
    value: 'เกษตรกรเตรียมยาเอง',
  });
  const [isFocus, setIsFocus] = React.useState(false);
  const onSelected = (item: {id: string; label: string; value: string}) => {
    setSelected(item);
    setTaskData(prev => ({
      ...prev,
      preparationBy: item.value,
      preparationRemark: '',
    }));
  };
  const fadeInOpacity = useRef(new Animated.Value(0)).current;

  const isShowTextArea = useMemo(() => {
    return selected.id === '2';
  }, [selected]);

  useEffect(() => {
    Animated.timing(fadeInOpacity, {
      toValue: isShowTextArea ? 1 : 0,
      duration: 500,
      useNativeDriver: true, // Using native driver for better performance
    }).start();
  }, [isShowTextArea, fadeInOpacity]);

  return (
    <>
      <View
        style={{
          height: 'auto',
        }}>
        <CardFarmer
          item={farmer}
          isSelected
          imageURL={farmer?.profileImage || ''}
        />
        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: colors.disable,
            marginVertical: 8,
          }}
        />
        <Text
          style={{
            fontFamily: font.medium,
            fontSize: normalize(16),
            color: colors.fontBlack,
            marginBottom: normalize(8),
          }}>
          ระบุการเตรียมยา
        </Text>
        {listData.map((el, index) => {
          const isLast = index === listData.length - 1;
          return (
            <RadioList
              label={el.label}
              key={el.id}
              onPress={() => {
                onSelected(el);
              }}
              isSelected={selected.id === el.id}
              styleWrapper={{
                marginBottom: isLast ? -4 : normalize(16),
              }}
            />
          );
        })}
        <Animated.View
          style={{
            opacity: fadeInOpacity,
          }}>
          {isShowTextArea && (
            <View
              style={{
                position: 'relative',
              }}>
              {(taskData?.preparationRemark || '').length < 1 && (
                <Text
                  style={{
                    position: 'absolute',
                    top: 28,
                    left: 10,
                    fontFamily: font.regular,
                    color: colors.grey40,
                    fontSize: 16,
                  }}>
                  จำเป็นต้องระบุชื่อยา/ปุ๋ย และจำนวนที่ใช้
                </Text>
              )}
              <TextInputArea
                onBlur={() => {
                  setIsFocus(false);
                }}
                onFocus={() => {
                  setIsFocus(true);
                }}
                style={{
                  borderWidth: 1,
                  borderRadius: normalize(8),
                  borderColor: isFocus ? colors.orange : colors.greyWhite,
                  paddingHorizontal: normalize(10),
                  minHeight: normalize(100),
                  marginBottom: normalize(8),
                  textAlignVertical: 'top',
                }}
                onChangeText={text => {
                  setTaskData(prev => ({
                    ...prev,
                    preparationRemark: text,
                  }));
                }}
                value={taskData.preparationRemark}
              />
            </View>
          )}
        </Animated.View>
      </View>
    </>
  );
};

export default StepTwo;
