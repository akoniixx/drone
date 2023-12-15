import {StyleSheet, View} from 'react-native';
import React from 'react';
import StepComponent from 'react-native-step-indicator';
import {colors, font} from '../../assets';
import {StepIndicatorProps} from 'react-native-step-indicator/lib/typescript/src/types';
import Text from '../Text';

type Props = {
  currentPosition: number;
  labelList: string[];
};

const StepIndicator = ({currentPosition, labelList}: Props) => {
  const customStyles: StepIndicatorProps['customStyles'] = {
    stepStrokeCurrentColor: colors.orange,
    stepIndicatorCurrentColor: colors.orangeSoft,
    stepStrokeWidth: 1,
    separatorStrokeWidth: 1,
    currentStepStrokeWidth: 1,
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 30,
    separatorFinishedColor: colors.orange,
    separatorUnFinishedColor: colors.softGrey2,
    stepIndicatorFinishedColor: colors.orangeSoft,
    stepIndicatorUnFinishedColor: '#FAFAFB',
    stepIndicatorLabelUnFinishedColor: colors.grey3,
    labelFontFamily: font.medium,
    stepStrokeUnFinishedColor: colors.grey3,
    stepStrokeFinishedColor: colors.orange,
    stepIndicatorLabelCurrentColor: colors.orange,
    stepIndicatorLabelFinishedColor: colors.orange,
    stepIndicatorLabelFontSize: 16,
    currentStepLabelColor: colors.fontBlack,
    currentStepIndicatorLabelFontSize: 16,
  };
  return (
    <View
      style={{
        paddingVertical: 8,
      }}>
      <StepComponent
        customStyles={customStyles}
        currentPosition={currentPosition}
        labels={labelList}
        stepCount={labelList.length}
        renderLabel={({position, stepStatus, label, currentPosition}) => {
          const isCurrent = position === currentPosition;
          const isFinished = stepStatus === 'finished';
          return (
            <Text
              style={{
                fontFamily: font.medium,
                fontSize: 16,
                color:
                  isCurrent || isFinished ? colors.fontBlack : colors.grey3,
              }}>
              {label}
            </Text>
          );
        }}
      />
    </View>
  );
};

export default StepIndicator;

const styles = StyleSheet.create({});
