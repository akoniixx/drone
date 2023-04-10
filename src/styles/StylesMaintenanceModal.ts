import { Dimensions, StyleSheet } from 'react-native';
import { normalize } from '../function/Normalize';
import { colors } from '../assets';
import fonts from '../assets/fonts';


const width = Dimensions.get('screen').width;

export const ModalStyle = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    top: normalize(20),
    right: normalize(20),
  },
  modalBg: {
    position: 'relative',
    backgroundColor: colors.white,
    width: width * 0.8,
    paddingVertical: normalize(30),
    paddingHorizontal: normalize(20),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(8),
  },
  modalHeader: {
    color: colors.fontBlack,
    fontFamily: fonts.medium,
    textAlign: 'center',
    fontSize: normalize(19),
  },
  modalMain: {
    color: colors.fontBlack,
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: normalize(15),
  },
  image: {
    width: normalize(144),
    height: normalize(140),
  },
});
