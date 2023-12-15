import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CardFarmer from '../../components/CardFarmer/CardFarmer';
import DateInputFarmer from '../../components/Input/DateInputFarmer';

type Props = {
  farmer: any;
};

const StepOne = ({farmer}: Props) => {
  return (
    <View>
      <CardFarmer item={farmer} isSelected />
      <DateInputFarmer />
    </View>
  );
};

export default StepOne;

const styles = StyleSheet.create({});
