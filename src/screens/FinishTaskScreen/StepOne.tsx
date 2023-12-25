import {
  Dimensions,
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import Text from '../../components/Text';
import {colors, font, icons, image} from '../../assets';
import Example from '../../components/Modal/ModalTaskDone/ModalImageExample';
import AsyncButton from '../../components/Button/AsyncButton';
import ModalUploadImage from '../../components/Modal/ModalUploadImage';
import ImageCropPicker, {
  Image as ImageType,
} from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import moment from 'moment';
import {SHA256} from 'crypto-js';
import ModalImageThumbnail from '../../components/Modal/ModalImageThumbnail';
import {ImageDataType} from '.';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {lineOfficialURI} from '../../definitions/externalLink';

const mappingErrorMessage = {
  isDuplicate: 'อัพโหลดภาพซ้ำ กรุณาลบแล้วอัพโหลดภาพใหม่อีกครั้ง',
  isSize: 'อัพโหลดภาพที่มีขนาดเกิน 20 MB กรุณาลบแล้วอัพโหลดภาพใหม่อีกครั้ง',
  isAfterOnly: 'อัพโหลดภาพที่เกินระยะเวลางาน 48 ชั่วโมง กรุณาติดต่อเจ้าหน้าที่',
  isBeforeOnly:
    'อัพโหลดภาพที่เกินระยะเวลางาน 48 ชั่วโมง กรุณาติดต่อเจ้าหน้าที่',
  isAfterAndDuplicate:
    'ภาพที่อัพโหลดซ้ำและเกินระยะเวลางาน 48 ชั่วโมง กรุณาติดต่อเจ้าหน้าที่',
  isBeforeAndDuplicate:
    'ภาพที่อัพโหลดซ้ำและเกินระยะเวลางาน 48 ชั่วโมง กรุณาติดต่อเจ้าหน้าที่',
};
const convertErrorMessage = (
  errorTypeList: Array<
    'isAfter' | 'isBefore' | 'isSize' | 'isType' | 'isDuplicate'
  >,
): string | null => {
  const isOnlyDuplicate =
    errorTypeList.length === 1 && errorTypeList[0] === 'isDuplicate';
  const isOnlyAfter = errorTypeList[0] === 'isAfter';
  const isOnlyBefore = errorTypeList[0] === 'isBefore';
  const isAfterAndDuplicate =
    errorTypeList.includes('isAfter') && errorTypeList.includes('isDuplicate');
  const isBeforeAndDuplicate =
    errorTypeList.includes('isBefore') && errorTypeList.includes('isDuplicate');

  if (isAfterAndDuplicate) {
    return mappingErrorMessage.isAfterAndDuplicate;
  }
  if (isBeforeAndDuplicate) {
    return mappingErrorMessage.isBeforeAndDuplicate;
  }

  if (isOnlyDuplicate) {
    return mappingErrorMessage.isDuplicate;
  }
  if (isOnlyAfter) {
    return mappingErrorMessage.isAfterOnly;
  }
  if (isOnlyBefore) {
    return mappingErrorMessage.isBeforeOnly;
  }
  return null;
};

interface Props {
  imageData: ImageDataType;
  setImageData: React.Dispatch<React.SetStateAction<ImageDataType>>;
  taskAppointment: string;
}
const limitPhoto = 5;
export default function StepOne({
  imageData,
  setImageData,
  taskAppointment,
}: Props) {
  const [demoModal, setDemoModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [showModalSelectImage, setShowModalSelectImage] = React.useState(false);
  const onAddImageController = async () => {
    try {
      const result = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        compressImageMaxWidth: 1000,
        compressImageMaxHeight: 1000,
        compressImageQuality: 0.8,
        forceJpg: true,
        multiple: true,
        maxFiles: limitPhoto - imageData.assets.length,
        minFiles: 1,
      });

      if (result && result.length > 0) {
        const hashMap: {[key: string]: boolean} = {};
        const format: any = imageData.assets.map(el => {
          return {
            path: el.uri,
            size: el.fileSize,
            mime: el.type,
            filename: el.fileName,
          };
        });
        const newResult = [...format, ...result];

        const array = newResult.map(async (item: ImageType) => {
          const fileData = await RNFS.readFile(item.path, 'base64');
          const convertSha = SHA256(fileData).toString();
          const errorMessages = [];
          const errorTypeList = [];
          const isDupImage = !!hashMap[convertSha];
          if (isDupImage) {
            errorMessages.push('ซ้ำ');
            errorTypeList.push('isDuplicate');
          } else {
            hashMap[convertSha] = true; // Add to hash map
          }
          const modifedDate =
            (Platform.OS === 'ios'
              ? item.creationDate
              : item.modificationDate) || moment().unix();
          const date = item?.modificationDate
            ? moment(moment.unix(+modifedDate))
            : moment();
          const isDateBefore48Hours = moment()
            .subtract(48, 'hours')
            .isAfter(date);
          const isDateAfter48Hours = moment(taskAppointment)
            .add(48, 'hours')
            .isBefore(date);

          // if (isDateBefore48Hours) {
          //   errorMessages.push('เกินเวลา');
          //   errorTypeList.push('isAfter');
          // }
          // if (isDateAfter48Hours) {
          //   errorMessages.push('เกินเวลา');
          //   errorTypeList.push('isBefore');
          // }

          if (item?.size) {
            const isFileMoreThan20MB = item.size > 20 * 1024 * 1024;
            if (isFileMoreThan20MB) {
              errorMessages.push('เกินขนาด');
              errorTypeList.push('isSize');
            }
          }

          return {
            fileSize: item.size,
            type: item.mime,
            fileName: item?.filename,
            uri: item.path,
            //   fileData: fileData,
            errorMessage: errorMessages,
            isError: errorMessages.length > 0,
            errorTypeList,
          };
        });
        const currentListPhoto = [...array];

        setShowModalSelectImage(false);
        setLoading(true);
        if (currentListPhoto.length > 5) {
          currentListPhoto.splice(5, currentListPhoto.length - 5);
        }

        const newAssets = await Promise.all([...currentListPhoto]).finally(
          () => {
            setLoading(false);
          },
        );
        //   console.log('newAssets :>> ', JSON.stringify(newAssets, null, 2));
        const errorTypeList = newAssets.reduce((acc: any, item: any) => {
          if (item.errorTypeList) {
            return [...acc, ...item.errorTypeList];
          }
          return acc;
        }, []);
        const uniqueErrorTypeList: any = [...new Set(errorTypeList)];
        const mutateResult = {
          isError: uniqueErrorTypeList.length > 0,
          assets: newAssets,
          errorMessage: convertErrorMessage(uniqueErrorTypeList),
        };
        setImageData(mutateResult as any);
      }
      return;
    } catch (err) {
      throw err;
    }
  };
  const onTakeImageController = async () => {
    const result = await ImageCropPicker.openCamera({
      mediaType: 'photo',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 0.8,
      forceJpg: true,
    });
    if (result) {
      const fileSize = result.size;
      const isFileMoreThan20MB = fileSize > 20 * 1024 * 1024;
      if (isFileMoreThan20MB) {
        setShowModalSelectImage(false);
        setImageData(prev => ({
          isError: true,
          assets: prev.assets,
          errorMessage: 'อัพโหลดภาพที่มีขนาดเกิน 20 MB',
        }));
        return false;
      }
      const newAssets = {
        fileSize: result.size,
        type: result.mime,
        fileName: result?.filename,
        uri: result.path,
        isError: false,
      } as ImageDataType['assets'][0];
      setShowModalSelectImage(false);
      setImageData(prev => ({
        assets: [...prev.assets, newAssets],
        isError: false,
        errorMessage: null,
      }));
    }
  };

  const onFinishedTakePhoto = useCallback(
    async (v: any) => {
      const isFileMoreThan5MB = v.assets[0].fileSize > 5 * 1024 * 1024;
      if (isFileMoreThan5MB) {
        //   setError('กรุณาอับโหลดรูปที่มีขนาดใหญ่ไม่เกิน 5 MB');
        setImageData(prev => ({
          isError: true,
          assets: prev.assets,
          errorMessage: 'อัพโหลดภาพที่มีขนาดเกิน 5 MB',
        }));

        return false;
      }
      const newPhoto = {
        errorMessage: [],
        isError: false,
        uri: v.assets[0].uri,
        fileSize: v.assets[0].fileSize,
        type: v.assets[0].type,
        errorTypeList: [],
        fileName: v.assets[0].fileName ? v.assets[0].fileName : moment().unix(),
      } as ImageDataType['assets'][0];

      setImageData(prev => ({
        assets: [...prev.assets, newPhoto],
        isError: false,
        errorMessage: null,
      }));

      setShowModalSelectImage(false);
    },
    [setImageData],
  );
  const onDeletedImage = async (index: number) => {
    const hashMap: {[key: string]: boolean} = {};

    const newAssets = imageData.assets?.filter((item, i) => {
      return i !== index;
    });

    if (newAssets) {
      const array = newAssets.map(async (item: any) => {
        const fileData = await RNFS.readFile(item.uri, 'base64');
        const convertSha = SHA256(fileData).toString();
        const isDupImage = !!hashMap[convertSha];
        const errorMessages = [...item?.errorMessage];
        const errorTypeList = [...item?.errorTypeList];
        if (isDupImage) {
          errorMessages.push('ซ้ำ');
          errorTypeList.push('isDuplicate');
        } else {
          hashMap[convertSha] = true; // Add to hash map
        }
        return {
          fileSize: item.fileSize,
          type: item.type,
          fileName: item.fileName,
          uri: item.uri,
          //   fileData: fileData,
          errorMessage: errorMessages,
          isError: errorMessages.length > 0,
          errorTypeList,
        };
      });
      const newFormat = await Promise.all([...array]).catch(err => {
        console.log(err);
        return;
      });
      if (!newFormat) {
        return;
      }
      const errorTypeList = newFormat.reduce((acc: any, item: any) => {
        if (item.errorTypeList) {
          return [...acc, ...item.errorTypeList];
        }
        return acc;
      }, []);
      const uniqueErrorTypeList: any = [...new Set(errorTypeList)];
      setImageData({
        isError: uniqueErrorTypeList.length > 0,
        assets: newFormat,
        errorMessage: convertErrorMessage(uniqueErrorTypeList),
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
  const isHaveError = useMemo(() => {
    return imageData.assets?.some(item => {
      return (
        item.errorTypeList?.includes('isAfter') ||
        item.errorTypeList?.includes('isBefore')
      );
    });
  }, [imageData.assets]);

  return (
    <View style={styles.container}>
      <Image source={image.previewController} style={styles.imageContainer} />
      <View style={styles.rowPreview}>
        <TouchableOpacity
          onPress={() => {
            setDemoModal(true);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image source={icons.showBrown} style={styles.icon} />
          <Text style={styles.textPreview}>ดูภาพตัวอย่าง</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <View style={styles.footer}>
        <View style={styles.rowFooter}>
          <View style={styles.leftFooter}>
            <Text style={styles.leftTitle}>อัพโหลดภาพหลักฐานการบิน</Text>
            <Text style={styles.subTitle}>สูงสุดจำนวน 5 ภาพ</Text>
            {imageData.errorMessage && (
              <Text
                style={{
                  color: colors.decreasePoint,
                  fontSize: 16,
                  lineHeight: 20,
                }}>
                {imageData.errorMessage}
              </Text>
            )}
            {isHaveError && (
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
              onPress={() => {
                setShowModalSelectImage(true);
              }}
              disabled={imageData.assets?.length >= 5}
              title={'+ เลือกรูป'}
              style={{
                borderRadius: 30,
                paddingVertical: 2,
                paddingHorizontal: 16,
                height: 46,
                width: 'auto',
                minHeight: 46,
              }}
              styleText={{
                fontSize: 16,
              }}
            />
          </View>
        </View>
        <View style={styles.imageListContainer}>
          {loading ? (
            <>
              <SkeletonPlaceholder
                speed={2000}
                backgroundColor={colors.skeleton}>
                <SkeletonPlaceholder.Item flexDirection="row" flexWrap="wrap">
                  {Array.from({length: 3}).map((_, index) => {
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
            </>
          ) : (
            imageData.assets?.map((item, index) => {
              const isError = item.isError;
              const errorMessage = item.errorMessage?.join('และ');
              return (
                <View
                  key={index}
                  style={{
                    marginTop: 8,
                    borderRadius: 12,

                    overflow: 'hidden',
                    marginBottom: 4,

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
                    onPress={() => {
                      onDeletedImage(index);
                    }}
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
                      uri: item.uri,
                    }}
                    thumbnailStyle={{
                      width: Dimensions.get('window').width / 3 - 32,
                      height: Dimensions.get('window').width / 3 - 32,
                      borderWidth: isError ? 2.5 : 0,
                      borderColor: colors.decreasePoint,
                      borderRadius: 8,
                    }}
                  />
                  {isError && (
                    <Text style={styles.textError}>ภาพ{errorMessage}</Text>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>
      <Example
        visible={demoModal}
        onPressBack={() => {
          setDemoModal(false);
        }}
      />
      <ModalUploadImage
        onCloseModalSelect={() => {
          setShowModalSelectImage(false);
        }}
        onFinishedTakePhoto={onFinishedTakePhoto}
        onCancel={() => {
          setShowModalSelectImage(false);
        }}
        onPressLibrary={onAddImageController}
        onPressCamera={() => {
          onTakeImageController();
        }}
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
    borderRadius: 12,
    width: Dimensions.get('window').width - 32,
    height: (Dimensions.get('window').width - 32) / 3,
    marginVertical: 16,
  },
  rowPreview: {
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  textPreview: {
    color: colors.darkOrange2,
    fontSize: 16,
    fontFamily: font.semiBold,
    marginLeft: 8,
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
  textError: {
    fontSize: 16,
    color: colors.decreasePoint,
    marginTop: 4,
    lineHeight: 20,
    width: Dimensions.get('window').width / 3 - 32,
  },
});
