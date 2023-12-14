import {Dimensions, Image, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import Text from '../../components/Text';
import CustomHeader from '../../components/CustomHeader';
import {StackNavigationProp} from '@react-navigation/stack/lib/typescript/src/types';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import {colors, font} from '../../assets';
import {numberWithCommas} from '../../function/utility';
import moment from 'moment';
import BadgeGuru from '../../components/BadgeGuru';
import {SafeAreaView} from 'react-native-safe-area-context';
import SectionFooter from './SectionFooter';
import {StackParamList} from '../../navigations/MainNavigator';
import {GuruKaset} from '../../datasource/GuruDatasource';
import ProgressiveImage from '../../components/ProgressingImage/ProgressingImage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'GuruDetailScreen'>;
  route: RouteProp<StackParamList, 'GuruDetailScreen'>;
}
interface GuruDetailData {
  _id: string;
  type: string;
  name: string;
  view: number;
  like: number;
  commentCount: number;
  read: number;
  application: string;
  status: string;
  grouping: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  description: string;
  image: string;
  startDateCronJob: null | string;
  startDate: null | string;
  favorite: boolean;
  groupName: string;
}

const GuruDetailScreen: React.FC<Props> = ({navigation, route}) => {
  const {guruId} = route.params;
  const isFocused = useIsFocused();
  const [guruDetail, setGuruDetail] = React.useState<GuruDetailData>({
    view: 0,
    commentCount: 0,
    like: 0,
  } as GuruDetailData);
  const [isLoved, setIsLoved] = React.useState(false);

  const loveCount = guruDetail.like;
  const commentCount = guruDetail.commentCount;
  const readCount = guruDetail.view;
  const dateCreate = moment(guruDetail.createdAt);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const getGuRuDetail = async () => {
      try {
        setLoading(true);
        const result = await GuruKaset.getGuruById({
          guruId: guruId || '',
        });
        setGuruDetail(result);
        setIsLoved(result.favorite);
        setLoading(false);
      } catch (error) {
        console.log('error guruDetail', error);
      } finally {
        setLoading(false);
      }
    };

    getGuRuDetail();
  }, [guruId, isFocused]);

  return (
    <SafeAreaView style={{flex: 1}} edges={['top', 'left', 'right']}>
      <CustomHeader
        styleWrapper={{
          height: 50,
          paddingHorizontal: 0,
        }}
        showBackBtn
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView
        style={styles.container}
        scrollIndicatorInsets={{
          right: 1,
        }}>
        <View style={styles.containerHeader}>
          <ProgressiveImage
            borderRadius={0}
            source={{
              uri: guruDetail.image,
            }}
            style={styles.imageHeader}
          />
        </View>
        {loading ? (
          <View style={styles.containerFooter}>
            <SkeletonPlaceholder
              backgroundColor={colors.skeleton}
              borderRadius={10}
              speed={2000}>
              <SkeletonPlaceholder.Item width="100%">
                <SkeletonPlaceholder.Item
                  height={16}
                  width={Dimensions.get('window').width - 64}
                  alignSelf="flex-start"
                  borderRadius={10}
                  marginBottom={8}
                />
                <SkeletonPlaceholder.Item
                  height={16}
                  width={Dimensions.get('window').width - 100}
                  borderRadius={10}
                  marginBottom={8}
                />
                <SkeletonPlaceholder.Item
                  height={16}
                  width={Dimensions.get('window').width - 200}
                  borderRadius={10}
                  marginBottom={12}
                />
                <SkeletonPlaceholder.Item
                  height={16}
                  width={30}
                  borderRadius={10}
                  marginBottom={12}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
        ) : (
          <View style={styles.containerFooter}>
            <Text numberOfLines={2} style={styles.textTitle}>
              {guruDetail.name}
            </Text>
            <View style={[styles.row, {marginTop: 8}]}>
              <Text style={styles.textNormal}>{dateCreate.fromNow()}</Text>
              <View style={[styles.row, {marginLeft: 16}]}>
                <Text style={styles.textNormal}>
                  {`อ่านแล้ว ${numberWithCommas(
                    readCount.toString(),
                    true,
                  )} ครั้ง`}
                </Text>
              </View>
            </View>
            <View style={styles.badge}>
              <BadgeGuru title={guruDetail.groupName} isDetail />
            </View>
            <SectionFooter
              loveCount={loveCount}
              commentCount={commentCount}
              description={guruDetail?.description}
              isLoved={isLoved}
              guruId={guruDetail._id}
              setIsLoved={setIsLoved}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
export default GuruDetailScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textNormal: {
    fontSize: 14,
    color: colors.grey40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.disable,
    marginVertical: 8,
  },
  imageHeader: {
    width: '100%',
    height: '100%',
  },
  textTitle: {
    fontSize: 20,
    fontFamily: font.semiBold,
    paddingRight: 32,
  },
  containerHeader: {
    height: 400,
    width: '100%',
  },
  containerFooter: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: colors.white,
    flex: 1,
    height: '100%',
  },
  badge: {
    marginTop: 8,
  },
});
