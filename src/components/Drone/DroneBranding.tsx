import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { normalize } from '../../function/Normalize'
import { colors, font } from '../../assets'

interface DroneBranding{
    dronebrand : string,
    serialbrand : string,
    status : string,
    image : string
}

export function StatusObject(status : string){
    switch (status) {
        case "PENDING":
            return {
                status : "รอการตรวจสอบ",
                colorBg : "#FDF0E3",
                fontColor : "#AE5700"
            }
        case "ACTIVE":
            return {
                status : "ตรวจสอบแล้ว",
                colorBg : "rgba(46, 198, 110, 0.15)",
                fontColor : "#014D40"
            }
        default:
            return {
                status : "รอการตรวจสอบ",
                colorBg : "#FDF0E3",
                fontColor : "#AE5700"
            }
    }
}

const DroneBrandingItem : React.FC<DroneBranding> = ({dronebrand,serialbrand,status,image}) => {
  
  return (
    <View style={{
      height : normalize(104),
      borderWidth : 0.5,
      borderColor : colors.disable,
      borderRadius : normalize(20),
      paddingVertical : normalize(10),
      paddingHorizontal : normalize(20),
      display : 'flex',
      flexDirection : 'row',
      justifyContent : 'space-between',
      alignItems : 'center',
      marginBottom: normalize(10),
    }}>
      <View style={{
        display : 'flex',
        justifyContent : 'space-between'
      }}>
        <View>
          <Text style={{    
            fontFamily: font.medium,
            fontSize: normalize(17),
            color: colors.fontBlack,}}>
            {dronebrand}
          </Text>
          <Text style={styles.label}>
            {serialbrand}
          </Text>
        </View>
        <View style={{
          width : normalize(109),
          height : normalize(24),
          borderRadius : normalize(12),
          display : 'flex',
          justifyContent : 'center',
          alignItems : 'center',
          backgroundColor : StatusObject(status).colorBg
          }}>
            <Text style={[styles.label,{color: StatusObject(status).fontColor}]}>{StatusObject(status).status}</Text>
        </View>
      </View>
      <Image source={{uri : image}} style={{
        width : normalize(60),
        height : normalize(60)
      }}/>
    </View>
  )
}

const styles = StyleSheet.create({
    label: {
      fontFamily: font.light,
      fontSize: normalize(14),
      color: colors.gray,
    },
})

export default DroneBrandingItem