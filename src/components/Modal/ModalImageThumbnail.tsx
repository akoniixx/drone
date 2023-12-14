import {
  View,
  ImageProps,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import Modal from './Modal';
import icons from '../../assets/icons/icons';
import {colors} from '../../assets';
import ZoomableImage from '../ZoomableImage/ZoomableImage';

interface Props {
  source: ImageProps['source'];
  thumbnailStyle: ImageProps['style'];
}
export default function ModalImageThumbnail({source, thumbnailStyle}: Props) {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const closeModal = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <Image source={source} style={thumbnailStyle} />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={isModalVisible}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={closeModal}
            style={{
              position: 'absolute',
              top: 40,
              right: 16,
              backgroundColor: colors.white,
              borderRadius: 20,
              padding: 8,
              zIndex: 999,
            }}>
            <Image
              source={icons.closeBlack}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <ZoomableImage source={source} style={styles.fullImage} />
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  fullImage: {
    width: Dimensions.get('window').width - 64,
    height: '100%',
  },
  modalContent: {
    padding: 32,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
