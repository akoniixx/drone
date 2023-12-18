/* eslint-disable @typescript-eslint/no-shadow */
import {
  View,
  TouchableOpacity,
  Platform,
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacityProps,
  Animated,
  ViewStyle,
  ScrollView,
} from 'react-native';
import React from 'react';
import {colors, font, icons} from '../../assets';
import DropDownPicker from 'react-native-dropdown-picker';
import fonts from '../../assets/fonts';
import Text from '../Text';

interface ItemDropdown {
  label: string;
  value: string;
  image?: ImageSourcePropType;
}
interface Props {
  onChange: any;
  placeholder?: string;
  items: ItemDropdown[];
  value: string;
  sizeImage?: number;
  customStyleInput?: boolean;
  stylesInput?: TouchableOpacityProps['style'];
  dropDownStyle?: ViewStyle;
}
export default function Dropdown({
  onChange,
  placeholder,
  items,
  value,
  sizeImage = 30,
  customStyleInput = false,
  stylesInput,
  dropDownStyle,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const rotateAnimation = React.useRef(new Animated.Value(0)).current;
  const handlePress = () => {
    Animated.timing(rotateAnimation, {
      toValue: open ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setOpen(!open);
  };

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const findItem = items.find(item => item.value === value);
  return (
    <>
      {customStyleInput && (
        <TouchableOpacity
          style={[styles.defaultStyle, stylesInput]}
          onPress={() => {
            handlePress();
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {findItem && findItem.image && (
              <Image
                source={findItem.image}
                style={{
                  width: sizeImage,
                  height: sizeImage,
                  marginRight: 8,
                }}
              />
            )}
            {findItem ? (
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: 16,
                }}>
                {findItem?.label}
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: font.medium,
                  fontSize: 16,
                  color: colors.grey2,
                }}>
                {placeholder}
              </Text>
            )}
          </View>
          <Animated.View style={{transform: [{rotate: spin}]}}>
            <Image
              source={icons.arrowDropdown}
              style={{
                width: 24,
                height: 24,
              }}
            />
          </Animated.View>
        </TouchableOpacity>
      )}

      {customStyleInput ? (
        <>
          {open && (
            <ScrollView
              style={{
                backgroundColor: colors.white,
                height: 200,
                position: 'absolute',
                borderRadius: 12,
                width: '100%',
                marginTop: 56,
                borderWidth: 1,
                borderColor: colors.grey3,
              }}>
              {items.map((item, idx) => {
                const {label, value, image} = item;
                const isLast = idx === items.length - 1;
                return (
                  <TouchableOpacity
                    style={{
                      minHeight: 40,
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: isLast ? 8 : 0,
                    }}
                    onPress={() => {
                      handlePress();
                      onChange({
                        label,
                        value,
                      });
                    }}>
                    {image && (
                      <Image
                        source={image}
                        style={{
                          width: sizeImage,
                          height: sizeImage,
                          marginRight: 8,
                        }}
                      />
                    )}
                    <Text style={{fontFamily: fonts.medium}}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </>
      ) : (
        <DropDownPicker
          disabled={items.length === 0}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          textStyle={{
            fontFamily: font.regular,
            fontSize: 16,
          }}
          zIndex={3000}
          zIndexInverse={3000}
          style={{
            display: customStyleInput ? 'none' : 'flex',
            borderWidth: 1,
            borderColor: colors.grey3,
            borderRadius: 5,
            paddingHorizontal: 16,
            minHeight: 56,
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: 16,
            zIndex: 3001,
          }}
          placeholder={placeholder}
          placeholderStyle={{
            color: colors.grey2,
            fontFamily: font.regular,
            fontSize: 16,
          }}
          containerStyle={{
            zIndex: 3001,
          }}
          renderListItem={({label, value, ...rest}: any) => {
            const {image} = rest.item as ItemDropdown;

            return (
              <TouchableOpacity
                style={{
                  minHeight: 40,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  handlePress();
                  onChange({
                    label,
                    value,
                  });
                }}>
                {image && (
                  <Image
                    source={image}
                    style={{
                      width: sizeImage,
                      height: sizeImage,
                      marginRight: 8,
                    }}
                  />
                )}
                <Text style={{fontFamily: fonts.medium}}>{label}</Text>
              </TouchableOpacity>
            );
          }}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={onChange}
          dropDownDirection="BOTTOM"
          dropDownContainerStyle={
            Platform.OS === 'ios'
              ? {
                  borderColor: colors.disable,
                  zIndex: 3001,

                  backgroundColor: colors.white,
                  ...dropDownStyle,
                }
              : {
                  position: 'relative',
                  top: 0,
                  borderColor: colors.disable,
                  zIndex: 3001,

                  backgroundColor: colors.white,
                  ...dropDownStyle,
                }
          }
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  defaultStyle: {
    borderWidth: 1,
    borderColor: colors.grey3,
    borderRadius: 8,
    height: 56,
    alignItems: 'center',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
