import {normalize} from '@rneui/themed';
import React from 'react';
import {useState} from 'react';
import {useWindowDimensions, StyleSheet} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import fonts from '../../assets/fonts';
import {colors} from '../../assets';
import FinishTask from '../../screens/MainTaskScreen/FinishTask';
import WaitStartTask from '../../screens/MainTaskScreen/WaitStartTask';
import InprogressTask from '../../screens/MainTaskScreen/InprogressTask';
import Text from '../../components/Text';
import {mixpanel} from '../../../mixpanel';
import {mappingTab} from '../../screens/MainTaskScreen/MainTaskScreen';
import {CurrentFilterType} from '../../components/Sheet/SheetFilterTask';

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

const renderScene = ({route, currentFilter, index}: any) => {
  switch (route.key) {
    case 'inprogress':
      return (
        <InprogressTask currentFilter={currentFilter} currentIndex={index} />
      );
    case 'waitStart':
      return (
        <WaitStartTask currentFilter={currentFilter} currentIndex={index} />
      );
    case 'finish':
      return <FinishTask currentFilter={currentFilter} currentIndex={index} />;
    default:
      return null;
  }
};
type Props = {
  index: number;
  setIndex: (index: number) => void;
  currentFilter: CurrentFilterType;
};
const MainTaskTapNavigator: React.FC<Props> = ({
  index,
  setIndex,
  currentFilter,
}) => {
  const layout = useWindowDimensions();
  const [routes] = useState(mappingTab);

  return (
    <TabView
      navigationState={{index, routes}}
      renderTabBar={renderTabBar}
      renderScene={({route}) =>
        renderScene({
          route,
          currentFilter,
          index,
        })
      }
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
