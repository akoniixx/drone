import {View, TouchableOpacity, Image, ScrollView} from 'react-native';
import React from 'react';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackParamList} from '../../navigations/MainNavigator';
import {colors, icons} from '../../assets';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomHeader from '../../components/CustomHeader';
import {rewardDatasource} from '../../datasource/RewardDatasource';
import CardRedeemDigital from '../../components/CardRedeemDigital/CardRedeemDigital';
import {DronerTransaction} from '../../types/TypeRewardDigital';
interface Props {
  navigation: any;
  route: RouteProp<StackParamList, 'RedeemDetailDigitalScreen'>;
}

export default function RedeemDetailDigitalScreen({navigation, route}: Props) {
  const {id, isFromHistory = false} = route.params;
  const [rewardDetailData, setRewardDetailData] =
    React.useState<DronerTransaction>({} as DronerTransaction);
  useFocusEffect(
    React.useCallback(() => {
      const getTransactionById = async () => {
        try {
          const result = await rewardDatasource.getRedeemDetail(id);

          setRewardDetailData(result);
        } catch (e) {
          console.log(e);
        }
      };
      getTransactionById();
    }, [id]),
  );
  return (
    <SafeAreaView
      edges={['right', 'top', 'left']}
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <CustomHeader
        styleWrapper={{
          height: 56,
        }}
        headerRight={() => {
          return (
            <TouchableOpacity
              onPress={() =>
                isFromHistory
                  ? navigation.goBack()
                  : navigation.navigate('MyRewardScreen', {
                      tab: 'history',
                    })
              }
              style={{
                padding: 16,
              }}>
              <Image
                source={icons.closeGreyX}
                style={{
                  width: 28,
                  height: 28,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
      {Object.keys(rewardDetailData).length > 0 ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 16,
            backgroundColor: '#f9fafd',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <CardRedeemDigital
                imagePath={rewardDetailData.reward.imagePath}
                data={
                  {
                    createAt: rewardDetailData.createAt,
                    dronerTransaction: {
                      ...rewardDetailData,
                    },
                  } as any
                }
                expiredUsedDate={rewardDetailData.reward.expiredUsedDate}
              />
            </View>
          </View>
        </ScrollView>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
}
