import {normalize} from '@rneui/themed';
import React from 'react';
import {useState} from 'react';
import {useWindowDimensions, StyleSheet} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import fonts from '../../assets/fonts';
// import font from "../../../android/app/build/intermediates/assets/debug/mergeDebugAssets/fonts/font";
import {colors} from '../../assets';
import NewTaskScreen from '../../screens/MainScreen/NewTaskScreen';
import TaskScreen from '../../screens/MainScreen/TaskScreen';
import {mixpanel} from '../../../mixpanel';
import Text from '../../components/Text';

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{backgroundColor: colors.orange}}
    style={{backgroundColor: colors.white}}
    renderLabel={({route, focused, color}) => (
      <Text
        style={[styles.label, {color: focused ? colors.orange : colors.gray}]}>
        {route.title}
      </Text>
    )}
  />
);

// const renderScene = SceneMap({
//   task: TaskScreen,
//   newTask: NewTaskScreen,
// });

interface Prop {
  isOpenReceiveTask: boolean;
  dronerStatus: string;
  navigation: any;
}

const TaskTapNavigator: React.FC<Prop> = (props: Prop) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'task', title: 'งานวันนี้'},
    {key: 'newTask', title: 'งานใหม่'},
  ]);
  const renderScene = ({route}: any) => {
    switch (route.key) {
      case 'task':
        mixpanel.track('MainScreen_TabTaskInProgress_Press');
        return (
          <TaskScreen
            dronerStatus={props.dronerStatus}
            navigation={props.navigation}
          />
        );
      case 'newTask':
        mixpanel.track('MainScreen_TabNewTask_Press');
        return (
          <NewTaskScreen
            navigation={props.navigation}
            isOpenReceiveTask={props.isOpenReceiveTask}
            dronerStatus={props.dronerStatus}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TabView
      key={index}
      navigationState={{index, routes}}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      lazy
    />
  );
};

export default TaskTapNavigator;

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.bold,
    fontSize: normalize(16),
  },
});
