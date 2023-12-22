import {LogBox, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import fonts from '../../assets/fonts';
import {colors} from '../../assets';
import {FlatList} from 'react-native';
import InputWithSuffix from '../Input/InputWithSuffix';
import {normalize} from '../../function/Normalize';

type Props = {
  setListTargetSpray: React.Dispatch<React.SetStateAction<string[]>>;
  listTargetSpray: string[];
  onChange?: (value: string[]) => void;
  value: string[];
};

const TargetSpraySelect = ({
  setListTargetSpray,
  listTargetSpray,
  onChange = () => {},
  value = [],
}: Props) => {
  const [otherPlant, setOtherPlant] = React.useState<string>('');
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);
  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontFamily: fonts.medium,
          color: colors.fontBlack,
        }}>
        เป้าหมาย
      </Text>

      <FlatList
        style={{
          width: '100%',
          paddingBottom: 32,
        }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <InputWithSuffix
            scrollEnabled={false}
            styleContainer={{
              marginTop: 16,
            }}
            value={otherPlant}
            placeholder="โปรดระบุ เช่น ย่อยสลายฟาง"
            onChangeText={text => {
              const removeSpaceFront = text.replace(/^\s+/, '');
              setOtherPlant(removeSpaceFront);
            }}
            suffixComponent={
              otherPlant && (
                <TouchableOpacity
                  onPress={() => {
                    if (value.includes(otherPlant)) {
                      return;
                    }
                    setListTargetSpray(prev => [...prev, otherPlant]);
                    setOtherPlant('');
                  }}
                  style={{
                    backgroundColor: colors.orange,
                    width: 60,
                    height: 35,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 16,
                      fontFamily: fonts.medium,
                    }}>
                    เพิ่ม
                  </Text>
                </TouchableOpacity>
              )
            }
          />
        }
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        data={listTargetSpray}
        numColumns={2}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              key={item}
              style={[
                styles.card,
                {
                  backgroundColor:
                    item && value.includes(item.toString())
                      ? colors.orangeSoft
                      : '#F2F3F4',
                  borderWidth: 1.5,
                  borderColor:
                    item && value.includes(item.toString())
                      ? colors.orange
                      : '#F2F3F4',
                },
              ]}
              onPress={() => {
                if (value.includes(item.toString())) {
                  onChange(value.filter(i => i !== item));
                } else {
                  onChange([...value, item]);
                }
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.regular,
                  lineHeight: 28,
                  color:
                    item && value.includes(item.toString())
                      ? colors.darkOrange2
                      : colors.fontBlack,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default TargetSpraySelect;

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: normalize(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(10),
    borderRadius: 6,
  },
});
