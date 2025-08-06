import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BottomtabNavigation from '../components/common/BottomTabNavigation';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import ChatsScreen from '../screens/ChatsScreen/ChatsScreen';
import PostsScreen from '../screens/PostsScreen/PostsScreen';


const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="chats"
      tabBar={(props: any) => <BottomtabNavigation {...props} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="chats" component={ChatsScreen} />
      <Tab.Screen name="posts" component={PostsScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
      
    </Tab.Navigator>
  );
};

export default BottomTab;


