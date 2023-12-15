import {
  View,
  Modal as RNModal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {colors, font, icons} from '../../assets';
import AsyncButton from '../Button/AsyncButton';
import Text from '../Text';

interface Props {
  children?: React.ReactNode;
  visible: boolean;
  title?: string | JSX.Element;
  subTitle?: string | JSX.Element;
  onPressPrimary?: () => void | Promise<void>;
  onPressSecondary?: () => void;
  titlePrimary?: string;
  titleSecondary?: string;
  showClose?: boolean;
  onClose?: () => void;
  iconTop?: JSX.Element;
  disablePrimary?: boolean;
  noBackdrop?: boolean;
}
export default function Modal({
  visible,
  children,
  title,
  subTitle,
  onPressPrimary,
  onPressSecondary,
  titlePrimary = 'ยืนยัน',
  titleSecondary = 'ยกเลิก',
  showClose = false,
  onClose,
  disablePrimary = false,
  iconTop,
  noBackdrop = false,
}: Props) {
  function isPromise(func: any) {
    return Promise.resolve(func) instanceof Promise;
  }
  const [loading, setLoading] = useState(false);
  return (
    <RNModal transparent={true} visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: noBackdrop ? 'transparent' : 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
        }}>
        {children ? (
          children
        ) : (
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingTop: 32,
              paddingBottom: 16,
              width: '100%',
              alignItems: 'center',
            }}>
            {showClose && (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 24,
                }}
                onPress={onClose}>
                <Image
                  source={icons.closeBlack}
                  style={{
                    width: 18,
                    height: 18,
                  }}
                />
              </TouchableOpacity>
            )}
            {iconTop && iconTop}

            {React.isValidElement(title) ? (
              title
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: font.medium,
                  color: colors.fontBlack,
                }}>
                {title}
              </Text>
            )}
            {React.isValidElement(subTitle) ? (
              subTitle
            ) : (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: font.regular,
                  color: colors.inkLight,
                  marginTop: 8,
                }}>
                {subTitle}
              </Text>
            )}
            <AsyncButton
              style={{
                marginTop: 24,
              }}
              disabled={disablePrimary}
              isLoading={loading}
              title={titlePrimary}
              onPress={async () => {
                const isPM = isPromise(onPressPrimary);
                if (isPM) {
                  try {
                    setLoading(true);
                    await onPressPrimary?.();
                  } catch (e) {
                    console.log(e);
                  } finally {
                    setLoading(false);
                  }
                } else {
                  onPressPrimary?.();
                }
              }}
            />
            <TouchableOpacity
              style={styles.subButton}
              onPress={() => {
                onPressSecondary && onPressSecondary();
              }}>
              <Text style={styles.textSubButton}>{titleSecondary}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </RNModal>
  );
}
const styles = StyleSheet.create({
  textButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.white,
  },
  button: {
    width: '100%',
    backgroundColor: colors.orange,
    borderRadius: 8,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F86820',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  textSubButton: {
    fontSize: 18,
    fontFamily: font.bold,
    color: colors.fontBlack,
  },
  subButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 8,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
});
