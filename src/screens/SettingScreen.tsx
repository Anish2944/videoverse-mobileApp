import React, {useState} from 'react';
import { Linking, Alert, Modal, View, TouchableOpacity, TextInput } from 'react-native';
import { List, Switch, Divider, Text, Button } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import tw from '../lib/tw'; // or wherever your tw() helper is exported
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResolvedTheme, useThemeStore } from '../store/themeStore';
import { useChangePassword, useHealthCheck } from '../hooks/useOther';
import Toast from 'react-native-toast-message';
const SettingsScreen = () => {
  const { logout } = useAuthStore();
  const { theme } = useThemeStore();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open link.');
    });
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {mutate: changePassword} = useChangePassword();

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      Toast.show({text1:'Passwords do not match'});
      return;
    }
    // Perform password change logic here
    changePassword({oldPassword, newPassword, confirmPassword});
    setIsEditModalVisible(false);
  };

  const { data: health } = useHealthCheck();

  return (
    <SafeAreaView style={tw`flex-1 justify-between p-4 ${useThemeStore().theme === 'dark' ? 'bg-black' : 'bg-white'}`} >
    <View>

   
      <Text className='text-xl font-semibold mb-2 text-text-dark dark:text-text-light'>
        Account
      </Text>
      <List.Item
        title="Change Password"
        left={(props) => <List.Icon {...props} icon="lock-reset" />}
        onPress={() => setIsEditModalVisible(true)}
      />
      <List.Item
        title="Logout"
        left={(props) => <List.Icon {...props} icon="logout" />}
        titleStyle={{ color: 'red' }}
        onPress={() => setIsModalVisible(true)}
      />

      <Divider style={tw`my-3`} />

      <Text className='text-xl font-semibold mb-2 text-black dark:text-white'>
        App Preferences
      </Text>
      <List.Item
        title="Dark Mode"
        left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
        right={() => {
            const { theme, toggleTheme } = useThemeStore();
            const resolvedTheme = useResolvedTheme();
            return (
            <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
            />
            );
        }}
        />

      <Divider style={tw`my-3`} />

      <Text className='text-xl font-semibold mb-2 text-black dark:text-white'>
        Support
      </Text>
      <List.Item
        title="Health Check"
        left={(props) => <List.Icon {...props} icon="heart-pulse" />}
        onPress={() => Toast.show({
          type: health?.status === 'OK' ? 'success' : 'error',
          text1: `Health Check: ${health?.status}`,
          text2: health?.message,
          position: 'bottom',
        })}
      />
      <List.Item
        title="Privacy Policy"
        left={(props) => <List.Icon {...props} icon="shield-lock" />}
        onPress={() => openLink('https://yourapp.com/privacy')}
      />
      <List.Item
        title="Terms of Service"
        left={(props) => <List.Icon {...props} icon="file-document" />}
        onPress={() => openLink('https://yourapp.com/terms')}
      />
      <List.Item
        title="Contact Support"
        left={(props) => <List.Icon {...props} icon="headset" />}
        onPress={() => openLink('mailto:anishkh0276@gmail.com')}
      />
    </View>
      <View className="items-center w-full">
        <Divider style={tw`my-3 w-2/3`} />
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          App Version: 1.0.5
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          © 2025 Videoverse
        </Text>
        {/* <TouchableOpacity onPress={() => openLink('https://yourapp.com/feedback')}>
          <Text className="text-sm text-blue-500 mt-2 underline">
            Give Feedback
          </Text>
        </TouchableOpacity> */}
        <Text className="text-xs text-gray-400 mt-1">
          Made with ❤ By Anish Kushwaha
        </Text>
      </View>
      <Modal
        transparent
        visible={isEditModalVisible}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-11/12 p-6 rounded-xl`}>
            <Text style={tw`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
              Change Password
            </Text>

            <TextInput
              style={tw`border p-2 rounded mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-black'} border-gray-300 dark:border-gray-700`}
              placeholder="Old Password"
              value={oldPassword}
              secureTextEntry
              onChangeText={setOldPassword}
              placeholderTextColor="#999"
            />
            <TextInput
              style={tw`border p-2 rounded mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-black'} border-gray-300 dark:border-gray-700`}
              placeholder="New Password"
              value={newPassword}
              secureTextEntry
              onChangeText={setNewPassword}
              placeholderTextColor="#999"
            />
            <TextInput
              style={tw`border p-2 rounded mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-black'} border-gray-300 dark:border-gray-700`}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />

            <View style={tw`flex-row justify-end mt-4`}>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Text style={tw`text-gray-500 mr-6`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePasswordChange}>
                <Text style={tw`text-blue-500 font-semibold`}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
        <Modal
        transparent
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-11/12 p-6 rounded-xl`}>
            <Text style={tw`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
              Logout Account
            </Text>
            <Text style={tw`mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
              Are you sure you want to logout ?
            </Text>
            <View style={tw`flex-row justify-end mt-4`}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={tw`text-gray-500 mr-6`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => logout()}>
                <Text style={tw`text-red-500 font-semibold`}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;
