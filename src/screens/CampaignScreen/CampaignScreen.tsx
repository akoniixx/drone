import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Campaign} from '../../datasource/CampaignDatasource';
import LinearGradient from 'react-native-linear-gradient';
import {normalize} from '../../function/Normalize';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import {CampaignEntitie, init_campaign} from '../../entities/CampaignEntitie';

import {font, icons} from '../../assets';
import colors from '../../assets/colors/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBarAnimated from '../../components/ProgressBarAnimated/ProgressBarAnimated';
import {momentExtend, thaiLongDate} from '../../function/utility';
import {mixpanel} from '../../../mixpanel';
import Text from '../../components/Text';
import {checkDecimal} from '../../function/checkDecimal';

const CampaignScreen: React.FC<any> = ({navigation, route}) => {
  const [campaign, setCampaign] = useState<CampaignEntitie>(init_campaign);
  const [loading, setLoading] = useState<boolean>(false);
  const [allValue, setAllValue] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [afterRai, setAfterRai] = useState<number>(0);
  const [raiIncondition, setRaiIncondition] = useState<number>(0);
  const width = Dimensions.get('window').width;
  useEffect(() => {
    fecthImage();
  }, []);

  const fecthImage = async () => {
    const dronerId = await AsyncStorage.getItem('droner_id');
    await Campaign.getImage('DRONER', 'QUATA', 'ACTIVE')
      .then(res => {
        setLoading(true);
        setCampaign(res.data[0]);
        setRaiIncondition(res.data[0].condition[0].rai);

        Campaign.getQuota(res.data[0].id, dronerId)
          .then(respon => {
            setLoading(true);
            setAllValue(respon.allValue);
            setAfterRai(respon.afterRai);
            setBalance(respon.balance);
          })
          .catch(err => console.log(err))
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <ScrollView style={{flex: 1, backgroundColor: '#FFF7EA'}}>
        <View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              zIndex: 1,
              top: '15%',
              left: '5%',
              backgroundColor: '#523A19',
              borderRadius: 50,
              padding: 5,
            }}
            onPress={() => navigation.goBack()}>
            <Image source={icons.closewhite} style={{width: 18, height: 18}} />
          </TouchableOpacity>
          <Image
            source={{uri: campaign.pathImageBanner}}
            style={{width: width, height: width}}
            resizeMode="cover"
          />
        </View>
        <View style={{paddingHorizontal: normalize(15)}}>
          <View
            style={{
              borderColor: '#B6A15C',
              borderRadius: 8,
              borderStyle: 'solid',
              borderWidth: 1,
            }}>
            <LinearGradient
              colors={['#FBF5B9', '#EED787']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={styles.campaignName}>
              <Text style={styles.campaignNameFont}>
                {campaign.campaignName}
              </Text>
              <Text style={styles.campaignDesFont}>{campaign.description}</Text>
            </LinearGradient>
            <LinearGradient
              colors={['#F6EAA7', '#FFF7EA']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{width: '50%', alignItems: 'center'}}>
                  <Image
                    source={{uri: campaign.pathImageReward}}
                    style={{width: normalize(100), height: normalize(100)}}
                  />
                </View>

                <View style={{width: '50%', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: font.medium,
                      fontSize: normalize(14),
                      color: '#B26003',
                    }}>
                    จับรางวัลครั้งถัดไป
                  </Text>
                  <Text
                    style={[
                      styles.rewardFont,
                      {fontFamily: font.bold, marginTop: 5},
                    ]}>
                    {thaiLongDate(campaign?.awardDate)}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            <View style={{paddingHorizontal: 20}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.rewardFont}>จำนวนไร่สะสม </Text>
                <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                  <Text
                    style={[
                      styles.rewardFont,
                      {fontSize: normalize(28), marginRight: 20},
                    ]}>
                    {afterRai ? checkDecimal(afterRai) : 0}
                  </Text>
                  <Text style={[styles.rewardFont, {marginBottom: 2}]}>
                    ไร่
                  </Text>
                </View>
              </View>
              <ProgressBarAnimated
                current={afterRai % raiIncondition}
                total={raiIncondition}
              />
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                    }}>
                    เริ่มนับจำนวนไร่สะสม{' '}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: font.medium,
                        fontSize: 16,
                        color: '#FB8705',
                      }}>
                      {afterRai ? afterRai % raiIncondition : 0}
                    </Text>
                    <Text style={{fontFamily: font.medium, fontSize: 16}}>
                      {'/' + raiIncondition}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                  }}>
                  ตั้งแต่{' '}
                  {momentExtend.toBuddhistYear(campaign.startDate, 'DD MMM YY')}{' '}
                  ถึง{' '}
                  {momentExtend.toBuddhistYear(campaign.endDate, 'DD MMM YY')}
                </Text>
              </View>
            </View>
            <LinearGradient
              colors={['#B89650', '#947D39']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              style={{
                marginTop: normalize(10),
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                }}>
                <View style={{width: '33%', alignItems: 'center'}}>
                  <Text style={[styles.valueFont]}>ได้รับ</Text>
                  <Text style={[styles.valueFont]}>ทั้งหมด</Text>
                  <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                    <Text style={[styles.valueFont, {fontSize: 32}]}>
                      {allValue ? allValue : 0}
                    </Text>
                    <Text
                      style={[styles.valueFont, {fontSize: 12, marginLeft: 5}]}>
                      สิทธิ์
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '33%',
                    borderLeftWidth: 0.5,
                    borderRightWidth: 0.5,
                    alignItems: 'center',
                    borderColor: 'white',
                  }}>
                  <Text style={[styles.valueFont]}>ใช้ไป</Text>
                  <Text style={[styles.valueFont]}>(ได้รับทอง)</Text>
                  <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                    <Text style={[styles.valueFont, {fontSize: 32}]}>
                      {allValue ? allValue - balance : 0}
                    </Text>
                    <Text
                      style={[styles.valueFont, {fontSize: 12, marginLeft: 5}]}>
                      สิทธิ์
                    </Text>
                  </View>
                </View>

                <View style={{width: '33%', alignItems: 'center'}}>
                  <Text style={[styles.valueFont]}>คงเหลือ</Text>
                  <Text style={[styles.valueFont]}>(ลุ้นโชคครั้งถัดไป)</Text>
                  <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                    <Text
                      style={[
                        styles.valueFont,
                        {fontSize: 32, color: '#FFFA7D'},
                      ]}>
                      {balance ? balance : 0}
                    </Text>
                    <Text
                      style={[styles.valueFont, {fontSize: 12, marginLeft: 5}]}>
                      สิทธิ์
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
          <View
            style={{
              marginTop: normalize(24),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('กดดูตารางจับรางวัลทอง');
                navigation.navigate('DateCampaignScreen', {
                  image: campaign.pathImageRewardRound,
                });
              }}>
              <View style={styles.tableReward}>
                <Image
                  source={icons.tableReward}
                  style={{width: normalize(51.4), height: normalize(44)}}
                />
                <View style={{marginLeft: 12}}>
                  <Text
                    style={[
                      styles.campaignNameFont,
                      {fontSize: normalize(16)},
                    ]}>
                    ตาราง
                  </Text>
                  <Text
                    style={[
                      styles.campaignNameFont,
                      {fontSize: normalize(16)},
                    ]}>
                    จับรางวัล
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('กดดูกติกาและเงื่อนไขทอง');
                navigation.navigate('RulesCampaignScreen', {
                  rules: campaign.rulesCampaign,
                });
              }}>
              <View style={styles.tableReward}>
                <Image
                  source={icons.ruleReward}
                  style={{width: normalize(38.72), height: normalize(44)}}
                />
                <View style={{marginLeft: 12}}>
                  <Text
                    style={[
                      styles.campaignNameFont,
                      {fontSize: normalize(16)},
                    ]}>
                    {' '}
                    กติกา
                  </Text>
                  <Text
                    style={[
                      styles.campaignNameFont,
                      {fontSize: normalize(16)},
                    ]}>
                    และเงื่อนไข
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: normalize(24), marginBottom: normalize(70)}}>
            <TouchableOpacity
              onPress={() => {
                mixpanel.track('กดดูประกาศรายชื่อผู้โชคดีรับสร้อยคอทองคำ');
                navigation.navigate('WinnerCampaignScreen');
              }}>
              <View
                style={[styles.tableReward, {justifyContent: 'flex-start'}]}>
                <Image
                  source={icons.ruleReward}
                  style={{width: normalize(38.72), height: normalize(44)}}
                />
                <View style={{marginLeft: 12}}>
                  <Text
                    style={[
                      styles.campaignNameFont,
                      {fontSize: normalize(16)},
                    ]}>
                    ประกาศรายชื่อผู้โชคดี
                  </Text>
                  <Text
                    style={[
                      styles.campaignNameFont,
                      {fontSize: normalize(16)},
                    ]}>
                    รับสร้อยคอทองคำ
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Spinner
        visible={loading}
        textContent="Loading..."
        textStyle={{color: '#FFF'}}
      />
    </>
  );
};

export default CampaignScreen;

const styles = StyleSheet.create({
  campaignName: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  campaignNameFont: {
    fontFamily: font.medium,
    fontSize: normalize(20),
    color: '#523A19',
  },
  campaignDesFont: {
    fontFamily: font.medium,
    fontSize: normalize(14),
    color: '#87602A',
    textAlign: 'center',
  },
  rewardFont: {
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.blown,
    textAlign: 'center',
  },
  valueFont: {
    fontFamily: font.medium,
    fontSize: normalize(14),
    color: colors.white,
  },
  tableReward: {
    borderColor: '#B6A15C',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#F6EAA7',
    flexDirection: 'row',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
