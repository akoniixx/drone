import {View, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import Text from '../Text';
import {colors, font} from '../../assets';
interface Props {
  title: string;
  isDetail?: boolean;
}
export default function BadgeGuru({title, isDetail = false}: Props) {
  const {color} = useMemo(() => {
    return {
      color: isDetail ? colors.orange : colors.fontBlack,
    };
  }, [isDetail]);
  return (
    <View style={isDetail ? styles.badgeDetail : styles.badge}>
      <Text
        style={[
          styles.text,
          {
            color,
          },
        ]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeDetail: {
    borderRadius: 14,
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: colors.orangeSoft,
    width: 'auto',
    alignSelf: 'flex-start',
  },
  badge: {
    borderRadius: 14,
    position: 'absolute',
    right: 12,
    bottom: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
  },
  text: {
    fontSize: 14,
    fontFamily: font.semiBold,
  },
});
