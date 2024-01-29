import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import List from './List';
import Setting from './Setting';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { createContext } from 'react';

const Tab = createBottomTabNavigator();

export const Home: React.FC = () => {
  const Context = createContext(true);
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'deepskyblue' },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name='List'
        component={List}
        options={{ title: '一覧', tabBarIcon: ({ color, size }) => <Icon name='book' type='material' color={color} /> }}
      />
      <Tab.Screen
        name='Setting'
        component={Setting}
        options={{ title: '設定', tabBarIcon: ({ color, size }) => <Icon name='settings' type='material' color={color} /> }}
      />
    </Tab.Navigator>
  );
};
