import { View, Image, SafeAreaView, Platform, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { stylesCentral } from '../../styles/StylesCentral';
import { MainButton } from '../../components/Button/MainButton';
import { colors, font, image } from '../../assets';



import RNExitApp from 'react-native-kill-app';
import { MaintenanceSystem, MaintenanceSystem_INIT } from '../../entities/MaintenanceEntities';
import DateTimeMaintenance from '../../components/DateTimeMaintenance';
import { SystemMaintenance } from '../../datasource/MaintenanceDatasource';

const MaintenanceScreen: React.FC<any> = ({ navigation }) => {
  const [maintenance, setMaintenance] = useState<MaintenanceSystem>(
    MaintenanceSystem_INIT,
  );
  useEffect(() => {
    getMaintenance();
  }, []);
  const getMaintenance = async () => {
    await SystemMaintenance.Maintenance('DRONER')
      .then(res => {
        if (res.responseData) {
          setMaintenance(res.responseData);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <SafeAreaView style={stylesCentral.container}>
      {maintenance !== undefined && (
        <View
          style={{
            alignItems: 'center',
            marginTop: 180,
          }}>
          <Image
            source={image.maintenance}
            style={{ width: 156, height: 160 }}
          />
          <DateTimeMaintenance
            header={maintenance.header}
            dateStart={maintenance.dateStart}
            dateEnd={maintenance.dateEnd}
            text={maintenance.text}
            footer={''}
          />
          <View
            style={{
              marginTop: 30,
              width: 385,
            }}>
            <MainButton
              label="ปิด"
              color={colors.orange}
              fontColor={'white'}
              onPress={() => RNExitApp.exitApp()}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MaintenanceScreen;
