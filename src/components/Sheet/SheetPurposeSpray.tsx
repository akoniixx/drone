import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../Text';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import {Image} from 'react-native';
import {colors, font, icons} from '../../assets';
import {PurposeListType} from '../../screens/CreateTaskScreen';

export default function SheetPurposeSpray({sheetId, payload}: SheetProps) {
  const [currentValue, setCurrentValue] = React.useState<PurposeListType>({
    id: '',
    purposeSprayName: '',
    cropId: '',
  });
  const [purposeSprayList, setPurposeSprayList] = React.useState<
    PurposeListType[]
  >([]);
  React.useEffect(() => {
    if (payload?.currentValue) {
      setCurrentValue(payload?.currentValue);
    }
    if (payload?.purposeSprayList) {
      setPurposeSprayList(payload?.purposeSprayList);
    }
  }, [payload]);

  const onSelectPurposeSpray = async (item: PurposeListType) => {
    setCurrentValue(item);
    await SheetManager.hide(sheetId, {
      payload: {
        currentValue: item,
      },
    });
  };

  return (
    <ActionSheet
      useBottomSafeAreaPadding={false}
      id={sheetId}
      containerStyle={{
        height: '60%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}>
      <FlatList
        data={purposeSprayList}
        ListFooterComponent={
          <View
            style={{
              height: 40,
            }}
          />
        }
        stickyHeaderIndices={[0]}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.list}
              onPress={() => onSelectPurposeSpray(item)}>
              <Text
                style={{
                  width: '80%',
                  fontFamily: font.regular,
                  color: colors.fontBlack,
                }}>
                {item.purposeSprayName}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>ช่วงเวลา</Text>
              <TouchableOpacity
                onPress={async () =>
                  SheetManager.hide(sheetId, {
                    payload: {
                      currentValue: currentValue,
                    },
                  })
                }>
                <Image source={icons.closeBlack} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
          </>
        }
      />
    </ActionSheet>
  );
}
const styles = StyleSheet.create({
  list: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: colors.disable,
    marginLeft: 16,
  },
  title: {
    fontFamily: font.semiBold,
    fontSize: 20,
    color: colors.fontBlack,
  },
  count: {
    fontSize: 14,
    color: colors.grey40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.disable,
    backgroundColor: colors.white,
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
  commentContainer: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textComment: {
    fontSize: 16,
    color: colors.fontBlack,
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  textUsername: {
    fontFamily: font.semiBold,
    fontSize: 14,
  },
  commentRight: {
    flex: 1,
    backgroundColor: colors.softGrey2,
    borderRadius: 10,
    padding: 8,
  },
  right: {
    flex: 1,
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  like: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liked: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likedText: {
    color: colors.orange,
    fontFamily: font.semiBold,
  },
  likeFill: {
    marginLeft: 6,
    width: 12,
    height: 12,
  },
  moreText: {
    color: colors.grey40,
    fontFamily: font.semiBold,
  },
  container: {},
  moreButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
