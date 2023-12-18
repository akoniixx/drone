import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React, {useMemo} from 'react';
import CustomHeader from '../../components/CustomHeader';
import {colors, font, icons} from '../../assets';
import Text from '../../components/Text';
import {useAuth} from '../../contexts/AuthContext';
import {SafeAreaView} from 'react-native-safe-area-context';

interface Props {
  navigation: any;
}
export default function AdditionDocumentScreen({navigation}: Props) {
  const {
    state: {user},
  } = useAuth();
  const listDocument = useMemo(() => {
    const list = [
      {
        id: 1,
        title: 'อัปโหลดรูปถ่ายผู้สมัครคู่บัตรประชาชน',
        desc: 'บริษัทใช้เป็นหลักฐานการรับของรางวัล',
        onPress: () => {
          navigation.navigate('NewAddIDCardScreen');
        },
        isDone: user?.isIdCard,
      },
      {
        id: 2,
        title: 'อัปโหลดสมุดบัญชีธนาคาร',
        desc: 'บริษัทใช้เป็นหลักฐานการโอนเงินงานในระบบ',
        onPress: () => {
          const findBanking = user?.file.find(
            el => el.category === 'BOOK_BANK',
          );
          navigation.navigate('UploadBankingScreen', {
            bookBank: findBanking,
            profile: user,
          });
        },
        isDone: user?.isBookBank,
      },
    ];
    return list;
  }, [user, navigation]);
  return (
    <SafeAreaView>
      <CustomHeader
        title={'ส่งเอกสารเพิ่มเติม'}
        showBackBtn
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
          padding: 16,
        }}>
        {listDocument.map(el => {
          return (
            <TouchableOpacity style={styles.card} onPress={el.onPress}>
              <View>
                <Text
                  style={{
                    fontFamily: font.medium,
                    fontSize: 16,
                    color: colors.fontBlack,
                  }}>
                  {el.title}
                </Text>
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                  }}>
                  {el.desc}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {el.isDone && (
                  <Image
                    source={icons.checkFillSuccess}
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 8,
                    }}
                  />
                )}

                <Image
                  source={icons.arrowRight}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.softGrey2,
    marginBottom: 8,
    minHeight: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 16,
  },
});
