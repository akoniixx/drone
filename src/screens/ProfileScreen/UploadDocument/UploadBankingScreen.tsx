import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, font, icons } from "../../../assets"
import { normalize } from "../../../function/Normalize"
import { stylesCentral } from "../../../styles/StylesCentral"
import * as ImagePicker from 'react-native-image-picker';
import { MainButton } from '../../../components/Button/MainButton';
import { ScrollView } from 'react-native-gesture-handler';
import { Authentication } from '../../../datasource/AuthDatasource';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { SimpleAccordion } from 'react-native-simple-accordion';
const width = Dimensions.get('window').width;
const UploadBankingScreen: React.FC<any> = ({ navigation, route }) => {
    const previousBookbank = route.params.bookBank;
    const [nameAccount, setNameAccount] = useState<string>('');
    const [numAccount, setNumAccount] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [banks, setBanks] = useState([
        {
            "bankName": "",
            "logoPath": icons.x
          }
      ])
    const [openBankDropdown, setOpenBankDropdown] = useState(false);
    const [bankValue, setBankValue] = useState('');
    const [image, setImage] = useState<any>(null);
    const [checked1, setChecked1] = useState<boolean>(false);

    const bankItems = banks.map((bank) => ({
        label: bank.bankName,
        value: bank.bankName,
        icon: () => <Image source={{ uri: bank.logoPath }} style={styles.bankIcon} />,
      }));
    

    const onAddImage = useCallback(async () => {
        const result = await ImagePicker.launchImageLibrary({
            mediaType: 'photo',
        });
        if (!result.didCancel) {
            setImage(result);
        }
    }, [image]);

    const fetchBank = () => {
        setLoading(true)
        Authentication.getBankList()
        .then((res)=>{
            setBanks(res)
        })
        .catch(err=> console.log(err))
        .finally(()=>{
            setLoading(false)
        })
    }

    const onSubmit = () => {
        setLoading(true)
        Authentication.uploadBankImage(image)
        .then(res=>{
            Authentication.updateBookbank(false,bankValue,nameAccount,numAccount,checked1)
            .then(res=>{
               setLoading(true)
               console.log(res)
            })
            .catch(err=>{
                console.log('0000000')
            })
            .finally(()=>{
                setLoading(false)
            })
        })
        .catch(err=>{
            setLoading(false)
            console.log('ggg')
        })
        .finally(()=>{
            setLoading(false)
        })
    }

    const condition = (
        <View style={{backgroundColor:'#FAFAFB'}}>
            <Text>
            - กรณีหน้าสมุดบัญชีธนาคารที่ยื่นไม่ใช่ชื่อสมุดบัญชีธนาคารของท่าน กรุณาแนบภาพสำเนาสมุดบัญชีธนาคารบุคคลที่ท่านต้องการ 
            พร้อมเซ็นสำเนาถูกต้อง พร้อมชื่อและนามสกุลของท่านลงบนเอกสาร
            </Text>
            <Text>
            - เมื่อท่านติ๊กเลือกยินยอมในข้อตกลง (1) ถือว่าท่านยืนยันความถูกต้อง และครบถ้วนของข้อมูล 
            หากเกิดข้อผิดพลาดใดๆ ทางบริษัทจะไม่รับผิดชอบในความเสียหายที่เกิดขึ้นทุกกรณี กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดบันทึก 
            </Text>
            <Text>
            - สอบถามข้อมูลเพิ่มเติม กรุณาติดต่อเจ้าหน้าที่ โทร. 02-233-9000
            </Text>
        </View>
    )

    useEffect(()=>{
        fetchBank()
        console.log(previousBookbank)
    },[])
    return (
        <SafeAreaView style={[stylesCentral.container]}>
            <View style={styles.appBarBack}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={icons.arrowLeft} style={styles.listTileIcon} />
                </TouchableOpacity>
                <Text style={[styles.appBarHeader]}>อัพโหลดสมุดบัญชีธนาคาร </Text>
                <View style={styles.listTileIcon} />
            </View>
            <ScrollView>
                <View style={styles.body}>
                    <View style={{ marginVertical: normalize(16) }}>
                        <Text style={styles.h1}>ระบุบัญชีธนาคาร</Text>
                    </View>

                    <DropDownPicker
                        listMode="SCROLLVIEW"
                        scrollViewProps={{
                            nestedScrollEnabled: true,
                        }}
                        zIndex={3000}
                        zIndexInverse={1000}
                        style={{
                            marginVertical: 10,
                            backgroundColor: colors.white,
                            borderColor: colors.disable,
                        }}
                        placeholder="เลือกธนาคาร"
                        placeholderStyle={{
                            color: colors.disable,
                        }}
                        open={openBankDropdown}
                        value={bankValue}

                        items={bankItems}
                        setOpen={setOpenBankDropdown}
                       /*  setItems={setBank} */
                        setValue={setBankValue}
                        dropDownDirection="BOTTOM"
                        dropDownContainerStyle={{
                            borderColor: colors.disable,
                        }}
                    />


                    <TextInput
                        onChangeText={(value: React.SetStateAction<string>) => {
                            setNameAccount(value)
                        }}
                        style={styles.input}
                        editable={true}
                        placeholder={'ชื่อบัญชี'}
                        placeholderTextColor={colors.disable}
                    />

                    <TextInput
                        onChangeText={(value: React.SetStateAction<string>) => {
                            setNumAccount(value)
                        }}
                        style={styles.input}
                        editable={true}
                        placeholder={'เลขที่บัญชี'}
                        placeholderTextColor={colors.disable}
                    />
                    <View style={styles.body}>
                        <View style={{ marginVertical: normalize(16) }}>
                            <Text style={styles.h1}>อัพโหลดหน้าสมุดบัญชีธนาคาร</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={{
                            marginVertical: 20,
                        }}
                        onPress={onAddImage}>
                        {image == null ? (
                            <View style={styles.addImage}>
                                <View style={styles.camera}>
                                    <Image
                                        source={icons.camera}
                                        style={{
                                            width: 19,
                                            height: 16,
                                        }}
                                    />

                                </View>
                                <Text>เพิ่มเอกสารด้วย ไฟล์รูป หรือ PDF</Text>
                            </View>
                        ) : (

                            <View style={{
                                width: width * 0.9,
                                height: normalize(76),
                                borderRadius: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#FFFBF6',
                                borderColor: '#FF981E',
                                borderWidth: 1,
                                paddingHorizontal: normalize(10)
                            }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                    <Image
                                        source={{ uri:image?image.assets[0].uri:'' }}
                                        style={{
                                            width: normalize(36),
                                            height: normalize(36),

                                        }}
                                    />
                                    <View style={{ width: '70%', marginLeft: 10 }}>
                                        <Text ellipsizeMode="tail" numberOfLines={1}>{image.assets[0].fileName}</Text>

                                    </View>
                                </View>
                                <Image source={icons.closeBlack} style={{ width: normalize(16), height: normalize(16) }} />

                            </View>

                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => setChecked1(!checked1)}
                >
                    <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
                        <Image
                            source={checked1 ? icons.checked : icons.check}
                            style={{ width: normalize(20), height: normalize(20) }}
                        />

                        <Text
                            style={[
                                styles.label,
                                { color: colors.fontBlack, marginLeft: normalize(10) },
                            ]}>
                            ข้าพเจ้ายินยอมให้โอนเงินเข้าชื่อบัญชีธนาคารบุคคล
ดังกล่าวที่ไม่ใช่ชื่อบัญชีธนาคารของข้าพเจ้า (1)
                        </Text>
                    </View>
                </TouchableOpacity>

                <SimpleAccordion viewInside={condition} title={"หมายเหตุ กรณียื่นบัญชีธนาคารเป็นบุคคลอื่น"} titleStyle={{fontFamily:font.light,fontSize:normalize(14),color:'#B26003'}}
                bannerStyle={{backgroundColor:'#FAFAFB'}}
                viewContainerStyle={{backgroundColor:'#FAFAFB',shadowOpacity:0}}
                />

                </View>
            </ScrollView>
            <View style={{ paddingHorizontal: normalize(17) }}>
                <MainButton
                    label="บันทึก"
                    color={colors.orange}
                    onPress={onSubmit}
                />

                <MainButton
                    label="ลบข้อมูลบัญชีธนาคาร"
                    color={colors.white}
                    fontColor={colors.fontBlack}
                />
            </View>

            <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={{ color: '#E5E5E5'}}
        />
        </SafeAreaView>
    )
}
export default UploadBankingScreen

const styles = StyleSheet.create({
    appBarBack: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(12),
        alignItems: 'center',
    },
    appBarHeader: {
        fontFamily: font.bold,
        fontSize: normalize(19),
        color: colors.fontBlack,
    },

    listTileIcon: {
        width: normalize(24),
        height: normalize(24),
        color: colors.fontBlack,
    },
    header: {
        fontFamily: font.bold,
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(5),
        fontSize: normalize(18),
        color: colors.fontBlack,
    },
    body: {
        paddingHorizontal: normalize(16)
    },
    h1: {
        fontFamily: font.medium,
        fontSize: normalize(16)
    },
    input: {
        height: normalize(56),
        marginVertical: 12,
        padding: 10,
        borderColor: '#DCDFE3',
        borderWidth: 1,
        borderRadius: normalize(10),
        color: colors.fontBlack,
    },
    addImage: {
        width: width * 0.9,
        height: normalize(162),
        borderColor: '#FF981E',
        borderStyle: 'dotted',
        borderWidth: 0.5,
        backgroundColor: '#FAFAFB',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    camera: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
    },
    label: {
        fontFamily: font.light,
        fontSize: normalize(16),
        color: colors.gray,
    },
    bankIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
      },
});