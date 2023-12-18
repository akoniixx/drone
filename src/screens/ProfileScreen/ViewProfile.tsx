import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {stylesCentral} from '../../styles/StylesCentral';
import {normalize} from '../../function/Normalize';
import {colors, font, icons} from '../../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileDatasource} from '../../datasource/ProfileDatasource';
import {ScrollView} from 'react-native-gesture-handler';
import {QueryLocation} from '../../datasource/LocationDatasource';
import {momentExtend} from '../../function/utility';
import Text from '../../components/Text';
import {mixpanel} from '../../../mixpanel';

const ViewProfile: React.FC<any> = ({navigation}) => {
  const [initProfile, setInitProfile] = useState({
    firstname: '',
    lastname: '',
    birthDate: '',
    telephone: '',
    image: '',
    address1: '',
    address2: '',
    province: '',
    district: '',
    subdistrict: '',
    postal: '',
  });
  useEffect(() => {
    getProfile();
  }, []);
  const getProfile = async () => {
    const droner_id = await AsyncStorage.getItem('droner_id');
    ProfileDatasource.getProfile(droner_id!)
      .then(res => {
        const imgPath = res.file.filter((item: any) => {
          if (item.category === 'PROFILE_IMAGE') {
            return item;
          }
        });
        if (imgPath.length === 0) {
          QueryLocation.QueryProfileSubDistrict(res.address.districtId).then(
            resSub => {
              const address = resSub.filter((item: any) => {
                if (item.subdistrictId === res.address.subdistrictId) {
                  return item;
                }
              });
              if (!res.birthDate) {
                setInitProfile({
                  firstname: res.firstname,
                  lastname: res.lastname,
                  birthDate: '',
                  telephone: res.telephoneNo,
                  image: '',
                  address1: res.address.address1,
                  address2: res.address.address2,
                  province: address[0].provinceName,
                  district: address[0].districtName,
                  subdistrict: address[0].subdistrictName,
                  postal: res.address.postcode,
                });
              } else {
                const datetime = res.birthDate;
                const date = datetime.split('T')[0];
                setInitProfile({
                  firstname: res.firstname,
                  lastname: res.lastname,
                  birthDate: momentExtend.toBuddhistYear(date, 'DD MMM YYYY'),
                  telephone: res.telephoneNo,
                  image: '',
                  address1: res.address.address1,
                  address2: res.address.address2,
                  province: address[0].provinceName,
                  district: address[0].districtName,
                  subdistrict: address[0].subdistrictName,
                  postal: res.address.postcode,
                });
              }
            },
          );
        } else {
          ProfileDatasource.getImgePath(droner_id!, imgPath[0].path)
            .then(resImg => {
              QueryLocation.QueryProfileSubDistrict(
                res.address.districtId,
              ).then(resSub => {
                const address = resSub.filter((item: any) => {
                  if (item.subdistrictId === res.address.subdistrictId) {
                    return item;
                  }
                });
                if (!res.birthDate) {
                  setInitProfile({
                    firstname: res.firstname,
                    lastname: res.lastname,
                    birthDate: '',
                    telephone: res.telephoneNo,
                    image: resImg.url,
                    address1: res.address.address1,
                    address2: res.address.address2,
                    province: address[0].provinceName,
                    district: address[0].districtName,
                    subdistrict: address[0].subdistrictName,
                    postal: res.address.postcode,
                  });
                } else {
                  const datetime = res.birthDate;
                  const date = datetime.split('T')[0];
                  setInitProfile({
                    firstname: res.firstname,
                    lastname: res.lastname,
                    birthDate: momentExtend.toBuddhistYear(date, 'DD MMM YYYY'),
                    telephone: res.telephoneNo,
                    image: resImg.url,
                    address1: res.address.address1,
                    address2: res.address.address2,
                    province: address[0].provinceName,
                    district: address[0].districtName,
                    subdistrict: address[0].subdistrictName,
                    postal: res.address.postcode,
                  });
                }
              });
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };
  return (
    <SafeAreaView style={[stylesCentral.container]}>
      <View style={styles.appBarBack}>
        <TouchableOpacity
          onPress={() => {
            mixpanel.track('ProfileScreen_Back_Press');
            navigation.goBack();
          }}>
          <Image source={icons.arrowLeft} style={styles.listTileIcon} />
        </TouchableOpacity>
        <Text style={[styles.appBarHeader]}>{'ข้อมูลโปรไฟล์'}</Text>
        <View style={styles.listTileIcon} />
      </View>
      <View style={styles.body}>
        <ScrollView>
          <View
            style={{
              alignItems: 'center',
              marginBottom: normalize(20),
            }}>
            {initProfile.image ? (
              <Image
                source={{uri: initProfile.image}}
                style={styles.imgProfile}
              />
            ) : (
              <Image source={icons.account} style={styles.imgProfile} />
            )}
          </View>
          <Text style={styles.title}>ข้อมูลทั่วไป (โปรดระบุ)</Text>
          <View style={[styles.input, {backgroundColor: colors.disable}]}>
            <Text style={styles.label}>ชื่อ</Text>
            <TextInput
              allowFontScaling={false}
              style={styles.inputvalue}
              value={initProfile.firstname}
              editable={false}
              placeholderTextColor={colors.disable}
            />
          </View>
          <View style={[styles.input, {backgroundColor: colors.disable}]}>
            <Text style={styles.label}>นามสกุล</Text>
            <TextInput
              value={initProfile.lastname}
              allowFontScaling={false}
              style={styles.inputvalue}
              editable={false}
              placeholderTextColor={colors.disable}
            />
          </View>
          <View style={[styles.input, {backgroundColor: colors.disable}]}>
            <Text style={styles.label}>วัน/เดือน/ปี เกิด</Text>
            <TextInput
              allowFontScaling={false}
              value={initProfile.birthDate}
              style={styles.inputvalue}
              editable={false}
              placeholderTextColor={colors.disable}
            />
          </View>
          <View style={[styles.input, {backgroundColor: colors.disable}]}>
            <Text style={styles.label}>โทรศัพท์</Text>
            <TextInput
              allowFontScaling={false}
              value={initProfile.telephone}
              style={styles.inputvalue}
              editable={false}
              placeholderTextColor={colors.disable}
            />
          </View>
          <Text style={styles.title}>ที่อยู่</Text>
          <View style={[styles.input, {backgroundColor: colors.disable}]}>
            <Text style={styles.label}>บ้านเลขที่</Text>
            <TextInput
              value={initProfile.address1}
              style={styles.inputvalue}
              allowFontScaling={false}
              editable={false}
              placeholderTextColor={colors.disable}
            />
          </View>
          <View style={[styles.input, {backgroundColor: colors.disable}]}>
            <Text style={styles.label}>รายละเอียดที่ีอยู่ (หมู่ ถนน)</Text>
            <TextInput
              value={initProfile.address2}
              style={styles.inputvalue}
              editable={false}
              allowFontScaling={false}
              placeholderTextColor={colors.disable}
            />
          </View>
          <View style={[styles.input, {backgroundColor: colors.disable}]}>
            <Text style={styles.label}>จังหวัด</Text>
            <TextInput
              value={initProfile.province}
              style={styles.inputvalue}
              editable={false}
              allowFontScaling={false}
              placeholderTextColor={colors.disable}
            />
          </View>
          <View style={[styles.input, {backgroundColor: colors.disable}]}>
            <Text style={styles.label}>อำเภอ</Text>
            <TextInput
              value={initProfile.district}
              style={styles.inputvalue}
              editable={false}
              allowFontScaling={false}
              placeholderTextColor={colors.disable}
            />
          </View>
          <View style={[styles.input, {backgroundColor: colors.disable}]}>
            <Text style={styles.label}>ตำบล</Text>
            <TextInput
              value={initProfile.subdistrict}
              style={styles.inputvalue}
              editable={false}
              allowFontScaling={false}
              placeholderTextColor={colors.disable}
            />
          </View>
          <View style={[styles.input, {backgroundColor: colors.disable}]}>
            <Text style={styles.label}>รหัสไปรษณีย์</Text>
            <TextInput
              value={initProfile.postal}
              style={styles.inputvalue}
              editable={false}
              allowFontScaling={false}
              placeholderTextColor={colors.disable}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imgProfile: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
  },
  appBarBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(12),
    alignItems: 'center',
  },
  appBarHeader: {
    fontFamily: font.bold,
    fontSize: normalize(19),
    color: colors.fontBlack,
  },
  body: {
    flex: 9,
    paddingTop: normalize(10),
    paddingHorizontal: normalize(17),
  },
  listTileIcon: {
    width: normalize(24),
    height: normalize(24),
    color: colors.fontBlack,
  },
  title: {
    marginVertical: normalize(10),
    fontFamily: font.medium,
    fontSize: normalize(16),
    color: colors.fontBlack,
  },
  input: {
    height: normalize(56),
    marginVertical: normalize(12),
    justifyContent: 'center',
    paddingHorizontal: normalize(12),
    borderColor: colors.disable,
    borderWidth: normalize(1),
    borderRadius: normalize(10),
    fontFamily: font.regular,
    color: colors.fontBlack,
  },
  label: {
    fontFamily: font.regular,
    color: colors.fontBlack,
    fontSize: normalize(10),
  },
  inputvalue: {
    fontFamily: font.regular,
    color: colors.fontBlack,
    fontSize: normalize(16),
    paddingVertical: normalize(0),
  },
});

export default ViewProfile;
