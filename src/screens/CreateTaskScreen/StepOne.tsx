import {Dimensions, KeyboardAvoidingView, View} from 'react-native';
import React, {useMemo} from 'react';
import CardFarmer from '../../components/CardFarmer/CardFarmer';
import DateInputFarmer from '../../components/Input/DateInputFarmer';
import TimeInputFarmer from '../../components/Input/TimeInputFarmer';
import {InputData, PurposeListType} from '.';
import {FarmerResponse} from '../../entities/FarmerInterface';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {colors} from '../../assets';
import SelectPlotInput from '../../components/CreateTaskComponent/SelectPlotInput';
import RaiInput from '../../components/CreateTaskComponent/RaiInput';
import PurposeSprayInput from '../../components/CreateTaskComponent/PurposeSprayInput';
import TargetSpraySelect from '../../components/CreateTaskComponent/TargetSpraySelect';

type Props = {
  farmer: FarmerResponse;
  taskData: InputData;
  setTaskData: (v: InputData) => void;
  loadingFarmer: boolean;
  purposeList: PurposeListType[];
  setListTargetSpray: React.Dispatch<React.SetStateAction<string[]>>;
  listTargetSpray: string[];
};

const StepOne = ({
  farmer,
  setTaskData,
  taskData,
  loadingFarmer = false,
  purposeList = [],
  setListTargetSpray,
  listTargetSpray,
}: Props) => {
  const newFarmerPlot = useMemo(() => {
    if (!farmer.farmerPlot) {
      return [];
    }
    const plotsCopy = [...farmer.farmerPlot];
    const activePlot = plotsCopy.filter(el => el.status === 'ACTIVE') || [];
    const inactivePlot = plotsCopy.filter(el => el.status !== 'ACTIVE') || [];
    const newPlot = [...activePlot, ...inactivePlot];
    return newPlot;
  }, [farmer.farmerPlot]);
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
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: colors.disable,
          marginVertical: 8,
        }}
      />
      <View
        style={{
          height: 8,
        }}
      />
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
        onCancel={() => {
          setTaskData({
            ...taskData,
            time: {
              hour: 6,
              minute: 0,
            },
          });
        }}
      />
      <SelectPlotInput
        label="แปลงเกษตรกร"
        placeholder="เลือกแปลงเกษตรกร"
        farmerPlot={newFarmerPlot}
        value={taskData.plotDetail}
        onChange={v => {
          setTaskData({
            ...taskData,
            plotDetail: v,
            raiAmount: v?.rai,
            purposeSpray: {
              id: '',
              purposeSprayName: '',
            },
          });
        }}
      />
      <RaiInput
        placeholder="ระบุจำนวนไร่ที่เกษตรกรต้องการ"
        maximumRai={+taskData.plotDetail.rai || 0}
        onChangeText={v => {
          setTaskData({
            ...taskData,
            raiAmount: v,
          });
        }}
        value={taskData.raiAmount}
      />
      <PurposeSprayInput
        onChange={v => {
          setTaskData({
            ...taskData,
            purposeSpray: {
              id: v.id,
              purposeSprayName: v.purposeSprayName,
            },
          });
        }}
        value={taskData.purposeSpray}
        purposeSprayList={purposeList}
        label="ช่วงเวลา"
        placeholder="เลือกช่วงเวลา"
      />
      <TargetSpraySelect
        listTargetSpray={listTargetSpray}
        setListTargetSpray={setListTargetSpray}
        onChange={v => {
          setTaskData({
            ...taskData,
            targetSpray: v,
          });
        }}
        value={taskData.targetSpray}
      />
    </View>
  );
};

export default StepOne;
