import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {colors, font, icons, image} from '../../assets';
import Text from '../Text';
import ProgressBarAnimated from '../ProgressBarAnimated/ProgressBarAnimated';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import {numberWithCommas} from '../../function/utility';
interface Props {
  onPress?: () => void;
  isDouble?: boolean;
  isComplete?: boolean;
  isExpired?: boolean;
  isFullQuota?: boolean;
  title?: string;
  current?: number;
  total?: number;
  imageSource?: any;
  missionName?: string;
  description?: string | null;
  isStatusComplete?: boolean;
  isStatusRequest?: boolean;
  isMissionPoint?: boolean;
  point?: string | null;
}
export default function CardMission({
  isComplete = false,
  isDouble = false,
  isFullQuota = false,
  isExpired = false,
  current = 0,
  total = 100,
  imageSource,
  missionName,
  description,
  isStatusComplete = false,
  isMissionPoint = false,
  onPress,
  point = '0',
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isExpired ? colors.softGrey2 : colors.white,
        },
      ]}
      activeOpacity={0.8}
      onPress={onPress}>
      <View>
        {isMissionPoint ? (
          <Text
            numberOfLines={2}
            style={{
              fontSize: 16,
              fontFamily: font.bold,
            }}>
            {`บินสะสมครบ ${numberWithCommas(total.toString(), true)} ไร่`}
          </Text>
        ) : (
          <Text
            numberOfLines={2}
            style={{
              fontSize: 16,
              fontFamily: font.bold,
            }}>
            {missionName}
          </Text>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 4,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flex: 0.8,
            height: '100%',
            justifyContent: 'flex-start',
            paddingRight: 32,
          }}>
          <Text
            style={{
              marginTop: 4,
              fontSize: 14,
              fontFamily: font.regular,
            }}>
            {isMissionPoint
              ? `รับแต้มจำนวน ${numberWithCommas(
                  point ? point : '0',
                  true,
                )} แต้ม`
              : description
              ? description
              : '-'}
          </Text>

          <ProgressBarAnimated
            current={current}
            total={total}
            isDisabled={isExpired || isFullQuota}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {isComplete && (
                <Image
                  source={icons.checkFillSuccess}
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 4,
                  }}
                />
              )}

              <Text
                style={{
                  fontSize: 14,
                }}>
                {numberWithCommas(current.toString(), true)}/
                {numberWithCommas(total.toString(), true)}
              </Text>
            </View>

            {isComplete && !isStatusComplete && (
              <Text
                style={{
                  fontSize: 14,
                  color: colors.decreasePoint,
                }}>
                กดแลกของรางวัล
              </Text>
            )}
            {isComplete && isStatusComplete && (
              <Text
                style={{
                  fontSize: 14,
                  color: colors.green,
                }}>
                แลกของรางวัลแล้ว
              </Text>
            )}
          </View>
        </View>
        <View style={{flex: 0.2, alignItems: 'flex-end'}}>
          {isComplete && (
            <>
              <View
                style={{
                  width: 68,
                  height: 68,
                  zIndex: 1,
                  opacity: 0.7,
                  position: 'absolute',
                  borderRadius: 34,
                  backgroundColor: '#2AB263',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={image.successStamp}
                  style={{
                    width: 40,
                    height: 34,
                    zIndex: 4,
                  }}
                />
              </View>
            </>
          )}

          <>
            {isExpired || isFullQuota ? (
              <Grayscale>
                <ImageBackground
                  source={
                    isMissionPoint
                      ? image.missionPointImage
                      : {
                          uri: imageSource,
                        }
                  }
                  imageStyle={{
                    borderRadius: 34,
                  }}
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 34,
                  }}>
                  {isFullQuota && (
                    <>
                      <View
                        style={{
                          width: 68,
                          height: 68,
                          zIndex: 1,
                          opacity: 0.6,
                          position: 'absolute',
                          borderRadius: 34,
                          backgroundColor: colors.fontGrey,

                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      />
                      <Image
                        source={image.fullQuota}
                        style={{
                          width: 50,
                          height: 24,
                          position: 'absolute',
                          zIndex: 2,
                          top: 16,
                          left: 14,
                        }}
                      />
                    </>
                  )}

                  {isDouble && (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 24,
                        height: 24,
                        zIndex: 10,
                        borderRadius: 12,
                        backgroundColor: colors.disable,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: colors.white,
                      }}>
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: 14,
                          fontFamily: font.bold,
                          lineHeight: 14,
                        }}>
                        x2
                      </Text>
                    </View>
                  )}
                </ImageBackground>
              </Grayscale>
            ) : (
              <>
                <ImageBackground
                  source={
                    isMissionPoint
                      ? image.missionPointImage
                      : {
                          uri: imageSource,
                        }
                  }
                  imageStyle={{
                    borderRadius: 34,
                  }}
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 34,
                  }}
                />
                {isDouble && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 24,
                      height: 24,
                      zIndex: 10,
                      borderRadius: 12,
                      backgroundColor: colors.orange,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: colors.white,
                    }}>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: 14,
                        fontFamily: font.bold,
                        lineHeight: 14,
                      }}>
                      x2
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.disable,
    width: '100%',
    minHeight: 124,
    marginBottom: 16,
  },
});
