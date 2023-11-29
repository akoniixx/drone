import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../../components/Text';
import {colors, font, icons} from '../../assets';
import {numberWithCommas} from '../../function/utility';
import {SheetManager} from 'react-native-actions-sheet';

interface Props {
  loveCount: number;
  commentCount: number;
}
export default function SectionFooter({loveCount, commentCount}: Props) {
  const isOdd = Math.round(Math.random() * 10) % 2 === 0;
  const [isLoved, setIsLoved] = React.useState(isOdd);
  const onPressLove = () => {
    setIsLoved(prev => !prev);
  };
  const onOpenComment = async () => {
    await SheetManager.show('commentSheet', {
      payload: {
        commentCount,
      },
    });
  };
  const mockText = `
  “ยาเหลือง” ใช้แล้วติดถังพ่น!! นักบินโดรนสามารถใช้ยาอะไร ทดแทนได้บ้าง!! วันนี้กูรูเกษตรมีคำตอบ ?

  “ยาเหลือง” คือ สารเพนดิเมทาลิน 33% EC เป็นสารกำจัดวัชพืช ใช้ในช่วงก่อนวัชพืชงอก และวัชพืชกำลังงอก(pre-emergene & early post-emergene) กำจัดวัชพืชได้ทั้งใบแคบ และวัชพืชใบกว้าง ในนาหว่านข้าวแห้ง และพืชไร่ เช่น อ้อย มันสำปะหลัง ตัวยาจะ
  ออกฤทธิ์ดูดซึมเข้าทางปลายรากฝอยหรือราก
  แขนงและทางปลายยอดอ่อนของวัชพืชที่งอก
  จากเมล็ด สารเพนดิเมทาลิน ลักษณะเนื้อยาจะมีสีเหลือง
  เข้มถึงแม้จะนำไปเจือจางก่อนนำไปใช้งานก็ยังคงมีสีเหลือง ทำให้ถังเครื่องพ่นยา หรือถังโดรน
  พ่นยามักจะติดสีเหลืองนี้ไปด้วย ล้างออกยาก หากล้างไม่ดี ไม่สะอาด อาจส่งผลเสียต่อพืชได้
  กูรูเกษตร ขอแนะนำยาที่สามารถใช้ทดแทน “ยาเหลือง” ดังนี้
  `;
  return (
    <View style={styles.container}>
      <View style={styles.sectionTop}>
        <TouchableOpacity style={styles.row} onPress={onPressLove}>
          <Image
            source={isLoved ? icons.loveIcon : icons.loveFill}
            style={styles.icon}
          />
          <Text style={styles.textMedium}>
            ถูกใจ
            {loveCount > 0 && (
              <Text style={styles.textCount}>{` ${numberWithCommas(
                loveCount.toString(),
                true,
              )}`}</Text>
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={onOpenComment}>
          <Image source={icons.commentIcon} style={styles.icon} />
          <Text style={styles.textMedium}>
            ความคิดเห็น
            {commentCount > 0 && (
              <Text style={styles.textCount}>{` ${numberWithCommas(
                commentCount.toString(),
                true,
              )}`}</Text>
            )}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.textContent}>{mockText}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  sectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 50,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.greys5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  textMedium: {
    fontFamily: font.medium,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  content: {
    marginTop: 8,
  },
  textContent: {
    fontSize: 16,
    color: colors.fontBlack,
  },
  textCount: {
    fontSize: 14,
    color: colors.grey40,
  },
});
