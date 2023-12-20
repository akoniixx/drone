import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import CardFarmer from '../../components/CardFarmer/CardFarmer';
import DateInputFarmer from '../../components/Input/DateInputFarmer';
import TimeInputFarmer from '../../components/Input/TimeInputFarmer';
import {InputData} from '.';
import {FarmerResponse} from '../../entities/FarmerInterface';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {colors} from '../../assets';
import SelectPlotInput from '../../components/CreateTaskComponent/SelectPlotInput';
import RaiInput from '../../components/CreateTaskComponent/RaiInput';

type Props = {
  farmer: FarmerResponse;
  taskData: InputData;
  setTaskData: (v: InputData) => void;
  loadingFarmer: boolean;
};

const StepOne = ({
  farmer,
  setTaskData,
  taskData,
  loadingFarmer = false,
}: Props) => {
  return (
    <View>
      {loadingFarmer ? (
        <View>
          <SkeletonPlaceholder speed={2000} backgroundColor={colors.skeleton}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              padding={16}>
              <SkeletonPlaceholder.Item
                width={60}
                height={60}
                borderRadius={50}
                marginRight={20}
              />
              <SkeletonPlaceholder.Item
                height={60}
                borderRadius={4}
                width={Dimensions.get('window').width - 130}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        </View>
      ) : (
        <CardFarmer
          item={farmer}
          isSelected
          imageURL={farmer?.profileImage || ''}
        />
      )}
      <DateInputFarmer
        label="วันที่นัดหมาย"
        date={taskData.date}
        setDate={v => {
          setTaskData({
            ...taskData,
            date: v,
          });
        }}
      />
      <TimeInputFarmer
        label="เวลาที่นัดหมาย"
        value={taskData.time}
        onChange={v => {
          setTaskData({
            ...taskData,
            time: v,
          });
        }}
      />
      <SelectPlotInput
        label="แปลงเกษตรกร"
        placeholder="เลือกแปลงเกษตรกร"
        farmerPlot={farmer.farmerPlot}
        value={taskData.plotDetail}
        onChange={v => {
          setTaskData({
            ...taskData,
            plotDetail: v,
          });
        }}
      />
      <RaiInput placeholder="ระบุจำนวนไร่ที่เกษตรกรต้องการ" />
    </View>
  );
};

export default StepOne;
