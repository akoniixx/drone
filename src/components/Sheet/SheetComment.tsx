import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ActionSheet, {
  SheetManager,
  SheetProps,
} from 'react-native-actions-sheet';
import Text from '../Text';
import {colors, font, icons} from '../../assets';
import {Image} from 'react-native';
import moment from 'moment';

const mockDataComment = [
  {
    id: 1,
    user: {
      id: 1,
      name: 'John Doe',
      avatar: 'https://picsum.photos/200',
    },
    createdAt: moment().subtract(Math.round(Math.random() * 60), 'minutes'),
    likeCount: Math.round(Math.random() * 100),
    isLiked: false,
    comment:
      'การดูแลทุเรียนเล็กให้โตไว 1.พรวนดิน จากชายพุ่มตกออกไปเป็นวงแหวน กว้าง 30 เซนติเมตร ซึ่งจะช่วยให้ดิน่วนโปร่งรากทุเรียนสามารถชอนไชไปหาน้ำและอาหารได้สะดวก ซึ่งจะช่วยให้ดิน่วนโปร่งรากทุเรียนสามารถชอนไชไปหาน้ำและอาหารได้สะดวก',
  },
  {
    id: 2,
    user: {
      id: 2,
      name: 'สุขสวัส บินนาดี',
      avatar: 'https://picsum.photos/200',
    },
    createdAt: moment().subtract(Math.round(Math.random() * 60), 'minutes'),
    comment: 'เท่าที่มองจากภาพแล้วเห็นเหมือนมดแดง น่าจะเป็นแมลงปากดูดนะค่ะ',
    likeCount: Math.round(Math.random() * 100),
    isLiked: false,
  },
  {
    id: 3,
    user: {
      id: 3,
      name: 'วิทยา บินสูงเนิน',
      avatar: 'https://picsum.photos/200',
    },
    createdAt: moment().subtract(Math.round(Math.random() * 60), 'minutes'),
    comment: 'ดูรูปแล้วไม่ชัดว่าปลวกหรือไม่แต่ถ้าปลวก "พิโพนิล" ได้ผลดี',
    likeCount: Math.round(Math.random() * 100),
    isLiked: false,
  },
];

const ExpandableText = ({text}: {text: string}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  const textRef = React.useRef<any>(null);

  const onTextLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    const lineHeight = 20; // Adjust based on your styling
    const maxLines = 4;
    const maxHeight = lineHeight * maxLines;

    if (height > maxHeight) {
      setIsOverflowing(true);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <Text
        ref={textRef}
        style={styles.textComment}
        numberOfLines={isExpanded ? undefined : 4}
        onLayout={!isExpanded ? onTextLayout : undefined}>
        {text}
      </Text>
      {isOverflowing && (
        <TouchableOpacity onPress={toggleExpanded}>
          <Text style={styles.moreText}>
            {isExpanded ? 'ย่อเนื้อหา' : 'อ่านเพิ่ม'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function SheetComment({sheetId, payload}: SheetProps) {
  console.log('payload', payload);
  const commentCount = payload?.commentCount;
  const [dataComment, setDataComment] = React.useState(mockDataComment);
  const onPressLike = (id: number) => {
    const newData = [...dataComment].map(item => {
      if (item.id === id) {
        return {
          ...item,
          isLiked: !item.isLiked,
          likeCount: item.isLiked ? item.likeCount - 1 : item.likeCount + 1,
        };
      }
      return item;
    });
    setDataComment(newData);
  };
  return (
    <ActionSheet
      useBottomSafeAreaPadding={false}
      id={sheetId}
      containerStyle={{
        height: '90%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}>
      <FlatList
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>
                ความคิดเห็น
                <Text style={styles.count}>{` ${commentCount}`}</Text>
              </Text>
              <TouchableOpacity onPress={() => SheetManager.hide(sheetId)}>
                <Image source={icons.closeBlack} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
          </>
        }
        data={dataComment}
        renderItem={({item}) => {
          return (
            <View style={styles.commentContainer}>
              <Image source={{uri: item.user.avatar}} style={styles.avatar} />
              <View style={styles.right}>
                <View style={styles.commentRight}>
                  <Text style={styles.textUsername}>{item.user.name}</Text>
                  <ExpandableText text={item.comment} />
                </View>
                <View style={styles.row}>
                  <Text>{moment(item.createdAt).fromNow(true)} </Text>
                  <TouchableOpacity
                    onPress={() => onPressLike(item.id)}
                    style={item.isLiked ? styles.liked : styles.like}>
                    <Text
                      style={
                        item.isLiked
                          ? styles.likedText
                          : {color: colors.gray, fontFamily: font.semiBold}
                      }>
                      ถูกใจ
                    </Text>
                    {item.isLiked && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            width: 5,
                            height: 5,
                            backgroundColor: colors.fontBlack,
                            borderRadius: 6,
                            marginLeft: 5,
                          }}
                        />
                        <Image
                          source={icons.loveFill}
                          style={styles.likeFill}
                        />
                        <Text
                          style={{
                            fontSize: 14,
                          }}>
                          {item.likeCount > 0 && ` ${item.likeCount}`}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
      />
    </ActionSheet>
  );
}
const styles = StyleSheet.create({
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
