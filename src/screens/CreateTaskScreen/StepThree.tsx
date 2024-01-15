import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useMemo} from 'react';
import CardFarmer from '../../components/CardFarmer/CardFarmer';
import {FarmerResponse} from '../../entities/FarmerInterface';
import Text from '../../components/Text';
import {CalPriceType, InputData} from '.';
import moment from 'moment';
import {momentExtend, numberWithCommas} from '../../function/utility';
import {colors, font, icons, image} from '../../assets';
import {callcenterNumber} from '../../definitions/callCenterNumber';
import {mixpanel} from '../../../mixpanel';

type Props = {
  farmer: FarmerResponse;
  taskData: InputData;
  calPriceData: CalPriceType;
};
const mappingObj = {
  dateAppointment: 'วันนัดหมาย',
  plotFarm: 'แปลงเกษตรกร',
  preparation: 'การเตรียมยา',
  fee: 'ค่าบริการ',
};
const mappingICON = {
  dateAppointment: icons.calendarDarkGreen,
  plotFarm: icons.locationDarkGreen,
  preparation: icons.bottleDarkGreen,
  fee: icons.billDarkGreen,
};

const StepThree = ({farmer, taskData, calPriceData}: Props) => {
  const objData: any = useMemo(() => {
    const dateAppointment = {
      data: {
        label: 'วันที่นัดหมาย',
        value: momentExtend.toBuddhistYear(taskData.date, 'DD/MM/YYYY'),
      },
      time: {
        value: moment(taskData.time).format('HH:mm'),
        label: 'เวลาที่นัดหมาย',
      },
      purposeSpray: {
        value: taskData.purposeSpray?.purposeSprayName,
        label: 'ช่วงเวลา',
      },
      targetSpray: {
        value: taskData.targetSpray.join(', '),
        label: 'เป้าหมาย',
      },
    };
    const plotFarm = {
      plotName: {
        value: taskData.plotDetail.shortPlotName,
        label: 'แปลงเกษตร',
      },
      cropName: {
        value: taskData.plotDetail.cropName,
        label: 'พืชที่ปลูก',
      },
      amountRai: {
        value: `${taskData.raiAmount || 0} ไร่`,
        label: 'จำนวนไร่',
      },
      addressName: {
        value: `${taskData.plotDetail.plotArea.subdistrictName}/${taskData.plotDetail.plotArea.districtName}/${taskData.plotDetail.plotArea.provinceName}`,
        label: 'พื้นที่แปลง',
      },
    };
    const preparation = {
      preparationBy: {
        value: taskData?.preparationRemark || '',
        label: taskData.preparationBy,
      },
    };
    const fee = {
      payBy: {
        value: 'เงินสด',
        label: 'วิธีชำระเงิน',
      },
      pricePerRai: {
        value: `${calPriceData.pricePerRai} บาท/ไร่`,
        label: 'ราคาต่อไร่',
      },
      totalFee: {
        value: (
          <Text
            style={{
              fontSize: 16,
              fontFamily: font.bold,
              color: '#3EBD93',
            }}>
            {numberWithCommas(
              calPriceData?.netPrice ? calPriceData.netPrice.toString() : '0',
              true,
            )}{' '}
            บาท
          </Text>
        ),
        label: 'ค่าบริการ',
      },
    };
    return {
      dateAppointment,
      plotFarm,
      preparation,
      fee,
    };
  }, [taskData, calPriceData]);

  const objKeyArray = Object.keys(objData);
  return (
    <View>
      <CardFarmer
        item={farmer}
        isSelected
        imageURL={farmer?.profileImage || ''}
      />
      {objKeyArray.map((el, index) => {
        const mapKey = Object.keys(objData[el as keyof typeof objData]);
        const isLast = index === objKeyArray.length - 1;
        return (
          <>
            <View>
              <View style={styles.title}>
                <Image
                  source={mappingICON[el as keyof typeof mappingICON]}
                  style={styles.icons}
                />
                <Text style={styles.textTitle}>
                  {mappingObj[el as keyof typeof mappingObj]}
                </Text>
              </View>
              {mapKey.map(el2 => {
                const objNest = objData[el as keyof typeof objData];
                const value = objNest[el2 as keyof typeof objNest]?.value;
                const label = objNest[el2 as keyof typeof objNest]?.label;
                return (
                  <View style={styles.rowContent}>
                    <View style={styles.left}>
                      <Text
                        style={{
                          fontFamily: font.medium,
                        }}>
                        {label}
                      </Text>
                    </View>
                    <View style={styles.right}>
                      <Text>{value}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
            {!isLast && (
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: colors.softGrey2,
                  marginVertical: 16,
                }}
              />
            )}
          </>
        );
      })}
      <View style={styles.warningBox}>
        <View style={styles.leftSide}>
          <Image source={icons.warning} style={{marginRight: 10}} />
        </View>
        <View style={styles.rightSide}>
          <Text>
            หากราคาฉีดพ่นของท่านไม่สอดคล้องกับราคากลางที่แสดงในระบบ
            กรุณาติดต่อเจ้าหน้าที่
          </Text>
          <TouchableOpacity
            style={styles.buttonCallcenter}
            onPress={() => {
              mixpanel.track('CreateTaskScreen_CallCenter_Press', {
                to: 'CallCenter',
                tel: callcenterNumber,
              });
              Linking.openURL(`tel:${callcenterNumber}`);
            }}>
            <Image
              source={icons.callingWhiteSolid}
              style={{
                marginRight: 10,
                width: 24,
                height: 24,
              }}
            />
            <Text
              style={{
                color: colors.white,
                fontFamily: font.bold,
              }}>
              โทรหาเจ้าหน้าที่
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StepThree;

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icons: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  textTitle: {
    fontFamily: font.bold,
    fontSize: 18,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'flex-start',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  warningBox: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.softGrey2,
    padding: 10,
    marginBottom: 32,
    marginTop: 16,
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
    alignSelf: 'flex-start',
  },
  rightSide: {
    flex: 1,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  buttonCallcenter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.skyDark,
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: 'auto',
    alignSelf: 'flex-start',
  },
});
