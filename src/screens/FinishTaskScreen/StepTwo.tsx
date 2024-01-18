import {
  Dimensions,
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback} from 'react';
import Text from '../../components/Text';
import {colors, font, icons, image} from '../../assets';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncButton from '../../components/Button/AsyncButton';
import ModalUploadImage from '../../components/Modal/ModalUploadImage';
import ImageCropPicker from 'react-native-image-crop-picker';
import {ImageSprayType} from '.';
import ModalImageThumbnail from '../../components/Modal/ModalImageThumbnail';
import moment from 'moment';
import {lineOfficialURI} from '../../definitions/externalLink';

interface Props {
  imageSpray: ImageSprayType;
  setImageSpray: React.Dispatch<React.SetStateAction<ImageSprayType>>;
  taskAppointment: string;
}
export default function StepTwo({
  imageSpray,
  setImageSpray,
  taskAppointment,
}: Props) {
  const [showModalSelectImage, setShowModalSelectImage] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const onAddImageController = async () => {
    try {
      setLoading(true);
      const result = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        compressImageMaxWidth: 1000,
        compressImageMaxHeight: 1000,
        compressImageQuality: 0.8,
        forceJpg: true,
        multiple: false,
      });
      if (result) {
        const fileSize = result?.size;
        if (!fileSize) {
          setImageSpray({
            isError: true,
            errorMessage: 'รูปภาพไม่ถูกต้อง',
            assets: [],
          });
          setShowModalSelectImage(false);
          return;
        }
        const isFileMoreThan20MB = fileSize > 20 * 1024 * 1024;
        const createDate = result?.creationDate && +result?.creationDate;

        const modificationDate =
          result?.modificationDate && +result?.modificationDate;

        const modifedDate =
          Platform.OS === 'ios' ? createDate : modificationDate;
        const date = modifedDate
          ? moment.unix(modifedDate as number)
          : moment();
        const isDateBefore48Hours = moment()
          .subtract(48, 'hours')
          .isAfter(date);
        const isDateAfter48Hours = moment(taskAppointment)
          .add(48, 'hours')
          .isBefore(date);
        const isIOS = Platform.OS === 'ios';

        if (isDateBefore48Hours && isIOS) {
          setImageSpray({
            isError: true,
            errorMessage:
              'อัปโหลดภาพที่เกินระยะเวลางาน 48 ชั่วโมง กรุณาติดต่อเจ้าหน้าที่',
            assets: [],
          });
          setShowModalSelectImage(false);
          return;
        }
        if (isDateAfter48Hours && isIOS) {
          setImageSpray({
            isError: true,
            errorMessage:
              'อัปโหลดภาพที่เกินระยะเวลางาน 48 ชั่วโมง กรุณาติดต่อเจ้าหน้าที่',
            assets: [],
          });
          setShowModalSelectImage(false);
          return;
        }

        if (isFileMoreThan20MB) {
          // setError('กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 20 MB');
          setImageSpray({
            isError: true,
            errorMessage: 'กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 20 MB',
            assets: [],
          });
          setShowModalSelectImage(false);

          return false;
        }
        setImageSpray({
          isError: false,
          errorMessage: '',
          assets: [
            {
              fileSize: result.size,
              type: result.mime,
              fileName: result?.filename || '',
              uri: result.path,
            },
          ],
        });
      }

      return;
    } catch (error) {
      console.log('error', error);
      setImageSpray({
        isError: true,
        errorMessage: 'รูปภาพไม่ถูกต้อง',
        assets: [],
      });
      setShowModalSelectImage(false);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };
  const onDeletedImage = () => {
    setImageSpray({
      isError: false,
      errorMessage: '',
      assets: [],
    });
  };

  const onFinishedTakePhoto = useCallback(
    async (v: any) => {
      const isFileMoreThan5MB = v.assets[0].fileSize > 5 * 1024 * 1024;
      if (isFileMoreThan5MB) {
        setImageSpray({
          isError: true,
          errorMessage: 'กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 5 MB',
          assets: [],
        });
        setShowModalSelectImage(false);
        return false;
      }
      setImageSpray({
        isError: false,
        errorMessage: '',
        assets: [
          {
            fileSize: v.assets[0].fileSize,
            type: v.assets[0].type,
            fileName: v.assets[0].fileName,
            uri: v.assets[0].uri,
          },
        ],
      } as any);

      setShowModalSelectImage(false);
    },
    [setImageSpray, setShowModalSelectImage],
  );
  const onTakeImageController = async () => {
    const result = await ImageCropPicker.openCamera({
      mediaType: 'photo',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 0.8,
      forceJpg: true,
    });

    if (result) {
      const fileSize = result?.size;
      const isFileMoreThan20MB = fileSize > 20 * 1024 * 1024;
      // const isFileMoreThan3MB = fileSize > 3 * 1024 * 1024;

      if (isFileMoreThan20MB) {
        setImageSpray({
          isError: true,
          errorMessage: 'กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 20 MB',
          assets: [],
        });
        return false;
      }
      setImageSpray({
        isError: false,
        errorMessage: '',
        assets: [
          {
            fileSize: result.size,
            type: result.mime,
            fileName: result?.filename || '',
            uri: result.path,
          },
        ],
      });
    }
  };
  const onOpenLinkLineOfficial = () => {
    Linking.canOpenURL(lineOfficialURI).then(supported => {
      if (supported) {
        Linking.openURL(lineOfficialURI);
      } else {
        console.log("Don't know how to open URI: " + lineOfficialURI);
      }
    });
  };
  return (
    <View style={styles.container}>
      <Image
        source={image.defaultImageFertilizer}
        style={styles.imageContainer}
      />
      <Text style={styles.textPreview}>ตัวอย่างภาพถ่ายปุ๋ย/ยาที่ถูกต้อง</Text>
      <View style={styles.warningGray}>
        <Image
          source={icons.warningBlack}
          style={{
            width: 18,
            height: 18,
          }}
        />
        <Text
          style={{
            color: colors.gray,
            paddingLeft: 8,
            fontSize: 12,
            flex: 1,

            alignSelf: 'flex-start',
          }}>
          ลักษณะภาพที่อัปโหลดควรเห็นบรรจุภัณฑ์ปุ๋ยหรือยาที่ใช้ในงานครั้งนี้อย่างชัดเจน
        </Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.footer}>
        <View style={styles.rowFooter}>
          <View style={styles.leftFooter}>
            <Text style={styles.leftTitle}>อัปโหลดภาพปุ๋ย/ยา</Text>
            <Text style={styles.subTitle}>จำนวน 1 ภาพ</Text>
            {imageSpray.errorMessage && (
              <Text
                style={{
                  color: colors.decreasePoint,
                  fontSize: 16,
                  lineHeight: 20,
                }}>
                {imageSpray.errorMessage}
              </Text>
            )}
            {imageSpray.isError && (
              <TouchableOpacity
                onPress={onOpenLinkLineOfficial}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                  borderWidth: 1,
                  borderColor: colors.green,
                  padding: 10,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    color: colors.green,
                    fontSize: 16,
                    lineHeight: 20,
                    fontFamily: font.bold,
                  }}>
                  ติดต่อเจ้าหน้าที่ผ่าน
                </Text>
                <Image
                  source={image.lineChat}
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                    marginLeft: 4,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.rightFooter}>
            <AsyncButton
              disabled={imageSpray.assets.length > 0}
              onPress={() => {
                setShowModalSelectImage(true);
              }}
              title={'+ เลือกรูป'}
              style={{
                borderRadius: 30,
                paddingVertical: 2,
                paddingHorizontal: 16,
                height: 46,
                minHeight: 46,
                alignSelf: 'flex-start',
                width: 'auto',
              }}
              styleText={{
                fontSize: 16,
              }}
            />
          </View>
        </View>
        <View style={styles.imageListContainer}>
          {loading ? (
            <SkeletonPlaceholder speed={2000} backgroundColor={colors.skeleton}>
              <SkeletonPlaceholder.Item flexDirection="row" flexWrap="wrap">
                {Array.from({length: 1}).map((_, index) => {
                  return (
                    <SkeletonPlaceholder.Item
                      key={index}
                      width={Dimensions.get('window').width / 3 - 32}
                      height={Dimensions.get('window').width / 3 - 32}
                      borderRadius={8}
                      marginRight={12}
                      marginTop={8}
                    />
                  );
                })}
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          ) : (
            <React.Fragment>
              {imageSpray.assets.length > 0 && (
                <View
                  style={{
                    marginTop: 8,

                    overflow: 'hidden',
                    marginBottom: 4,
                    borderRadius: 12,

                    marginRight: 12,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.05,
                    shadowRadius: 3.84,
                    elevation: 5,
                    backgroundColor: colors.white,
                  }}>
                  <TouchableOpacity
                    onPress={onDeletedImage}
                    style={{
                      position: 'absolute',
                      zIndex: 999,
                      top: 4,
                      right: 4,
                      backgroundColor: colors.white,
                      padding: 6,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.05,
                      shadowRadius: 3.84,
                      elevation: 5,
                      borderRadius: 20,
                    }}>
                    <Image
                      source={icons.closeBlack}
                      style={{
                        width: 10,
                        height: 10,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                  <ModalImageThumbnail
                    source={{
                      uri: imageSpray.assets[0].uri,
                    }}
                    thumbnailStyle={{
                      width: Dimensions.get('window').width / 3 - 32,
                      height: Dimensions.get('window').width / 3 - 32,
                      //   borderWidth: isError ? 2.5 : 0,
                      //   borderColor: colors.decreasePoint,
                      borderRadius: 8,
                    }}
                  />
                  {/* {isError && (
                    <Text style={styles.textError}>ภาพ{errorMessage}</Text>
                  )} */}
                </View>
              )}
            </React.Fragment>
          )}
        </View>
      </View>
      <ModalUploadImage
        onCloseModalSelect={() => {
          setShowModalSelectImage(false);
        }}
        onPressCamera={onTakeImageController}
        onFinishedTakePhoto={onFinishedTakePhoto}
        onCancel={() => {
          setShowModalSelectImage(false);
        }}
        onPressLibrary={onAddImageController}
        visible={showModalSelectImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginTop: 16,
  },
  textPreview: {
    color: colors.darkOrange2,
    fontSize: 14,
    fontFamily: font.medium,
    textAlign: 'center',
    marginTop: 8,
  },
  warningGray: {
    backgroundColor: colors.grayBg,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    height: 'auto',
    width: '100%',
    marginTop: 8,
  },
  separator: {
    height: 1,
    backgroundColor: colors.disable,
    marginVertical: 16,
  },
  footer: {
    width: '100%',
  },
  rowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftFooter: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    flex: 0.6,
  },
  leftTitle: {
    fontFamily: font.semiBold,
    fontSize: 16,
    color: colors.fontBlack,
  },
  subTitle: {
    fontSize: 14,
    color: colors.fontBlack,
    marginBottom: 8,
    textAlign: 'center',
  },
  rightFooter: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  imageListContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
