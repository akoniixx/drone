import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../../components/Text';
import {Image} from 'react-native';
import mockGuru from '../../../assets/mockGuru';
import BadgeGuru from '../../../components/BadgeGuru';
import {colors, font, icons} from '../../../assets';
import moment from 'moment';
import {numberWithCommas} from '../../../function/utility';

interface Props {
  navigation: any;
}
export default function ItemContent({navigation}: Props) {
  const loveCount = Math.round(Math.random() * 1000);
  // const commentCount = Math.round(Math.random() * 1000);
  const readCount = Math.round(Math.random() * 10000);
  const dateCreate = moment().subtract(
    Math.round(Math.random() * 1000),
    'hours',
  );
  const mockId = Math.round(Math.random() * 1000);
  const isOdd = Math.round(Math.random() * 10) % 2 === 0;
  const onNavigateToDetail = () => {
    navigation.navigate('GuruDetailScreen', {
      guruId: mockId,
    });
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={onNavigateToDetail}>
        <Image source={mockGuru.imageContent} style={styles.image} />
        <BadgeGuru title="โรคพืช" />
      </Pressable>
      <View style={styles.containerFooter}>
        <Text numberOfLines={2} style={styles.textTitle}>
          3 หลักการแก้ปัญหาหญ้าข้าวนกดื้อยา หญ้าตัวร้ายปราบเซียนมืออาชีพ
          หญ้าตัวร้ายปราบเซียนมืออาชีพ หญ้าตัวร้ายปราบเซียนมืออาชีพ
        </Text>
        <Text style={styles.textDesc}>
          จากภาพ “ข้าวแสดงอาการเมล็ดลีบ”...
          <Text style={styles.textReadMore}>{' อ่านเพิ่ม'}</Text>
        </Text>
        <View style={styles.footer}>
          <View style={styles.row}>
            <View style={styles.row}>
              <Image
                source={isOdd ? icons.loveIcon : icons.loveFill}
                style={styles.icon}
              />
              <Text style={styles.textBold}>{loveCount}</Text>
            </View>
            {/* <View style={styles.row}> 
              <Image source={icons.commentIcon} style={styles.icon} />
              <Text style={styles.textBold}>{commentCount}</Text>
            </View> */}
          </View>
          <View style={styles.row}>
            <Text style={styles.textNormal}>{dateCreate.fromNow()}</Text>
            <Text style={styles.textNormal}>・</Text>
            <View style={[styles.row, {marginRight: 0}]}>
              <Image source={icons.showReadIcon} style={styles.icon} />
              <Text style={styles.textNormal}>
                {numberWithCommas(readCount.toString(), true)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    borderRadius: 10,
    height: 350,
  },
  container: {
    marginBottom: 16,
  },
  containerFooter: {
    width: '100%',
    paddingVertical: 8,
  },
  textTitle: {
    fontSize: 20,
    fontFamily: font.semiBold,
    paddingRight: 32,
  },
  textReadMore: {
    color: colors.gray,
  },
  textDesc: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  textBold: {
    fontFamily: font.bold,
    fontSize: 14,
  },
  textNormal: {
    fontSize: 12,
    color: colors.grey2,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.disable,
    marginVertical: 8,
  },
});
