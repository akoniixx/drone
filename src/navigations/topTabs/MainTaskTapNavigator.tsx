import {normalize} from '@rneui/themed';
import React, {useEffect} from 'react';
import {useState} from 'react';
import {useWindowDimensions, StyleSheet, View} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import fonts from '../../assets/fonts';
import {colors} from '../../assets';
import FinishTask from '../../screens/MainTaskScreen/FinishTask';
import WaitStartTask from '../../screens/MainTaskScreen/WaitStartTask';
import InprogressTask from '../../screens/MainTaskScreen/InprogressTask';
import Text from '../../components/Text';
import {mixpanel} from '../../../mixpanel';
import {useFocusEffect} from '@react-navigation/native';

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{backgroundColor: colors.orange}}
    style={{backgroundColor: colors.white}}
    renderLabel={({route, focused}) => (
      <Text
        style={[styles.label, {color: focused ? colors.orange : colors.gray}]}>
        {route.title}
      </Text>
    )}
  />
);

const renderScene = SceneMap({
  inprogress: InprogressTask,
  WaitStart: WaitStartTask,
  finish: FinishTask,
});
type Props = {
  index: number;
  setIndex: (index: number) => void;
};
const MainTaskTapNavigator: React.FC<Props> = ({index, setIndex}) => {
  const layout = useWindowDimensions();

  const [routes] = useState([
    {key: 'inprogress', title: 'กำลังดำเนินการ'},
    {key: 'WaitStart', title: 'รอเริ่มงาน'},
    {key: 'finish', title: 'งานเสร็จสิ้น'},
  ]);

  return (
    <TabView
      navigationState={{index, routes}}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={(idx: number) => {
        mixpanel.track('MainTaskScreen_TabView_ChangeTab', {
          tab: routes[idx].title,
        });
        setIndex(idx);
      }}
      initialLayout={{width: layout.width}}
      lazy
    />
  );
};

export default MainTaskTapNavigator;

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.bold,
    fontSize: normalize(14),
  },
});
