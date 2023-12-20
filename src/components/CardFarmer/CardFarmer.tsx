import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useMemo} from 'react';
import {colors, image} from '../../assets';
import ProgressiveImage from '../ProgressingImage/ProgressingImage';
import fonts from '../../assets/fonts';
import icons from '../../assets/icons/icons';
import {FarmerResponse} from '../../entities/FarmerInterface';

type Props = {
  item: FarmerResponse;
  navigation?: any;
  isSelected?: boolean;
  imageURL?: string;
};

const CardFarmer = ({
  item,
  navigation,
  isSelected = false,
  imageURL = '',
}: Props) => {
  const onPress = () => {
    navigation.navigate('CreateTaskScreen', {
      farmerId: item.id,
    });
  };

  return (
    <TouchableOpacity
      disabled={isSelected}
      style={isSelected ? styles.cardContainerSoftOrange : styles.cardContainer}
      onPress={isSelected ? () => undefined : onPress}>
      <View
        style={{
          marginRight: 16,
        }}>
        <ProgressiveImage
          source={{
            uri: imageURL,
          }}
          borderRadius={30}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
        />
      </View>

      <View
        style={{
          width: '100%',
          flex: 1,
        }}>
        <Text
          style={styles.textName}>{`${item.firstname} ${item.lastname}`}</Text>
        {item.nickname && (
          <Text style={styles.textNickname}>{item.nickname}</Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            flex: 1,
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',
            }}>
            <Image
              source={icons.callingGrey}
              style={{
                width: 16,
                height: 16,
                marginRight: 4,
              }}
            />
            <Text style={styles.textTel}>{item.telephoneNo}</Text>
          </View>
          <View
            style={{
              width: 16,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={icons.locationGrey}
              style={{
                width: 16,
                height: 16,
                marginRight: 4,
              }}
            />
            <Text style={styles.textTel}>{item?.province}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardFarmer;

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 1,
    borderColor: colors.disable,
    borderRadius: 8,
    flexDirection: 'row',
    minHeight: 80,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    flex: 1,
  },
  cardContainerSoftOrange: {
    borderWidth: 1,
    borderColor: colors.orangeSoft,
    backgroundColor: colors.orangeSoft,
    borderRadius: 8,
    flexDirection: 'row',
    minHeight: 80,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    flex: 1,
  },
  textName: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  textNickname: {
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  textTel: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.gray,
  },
});
