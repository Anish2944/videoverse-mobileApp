// types.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Home: undefined;
  Upload: undefined;
  MyProfile: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  AppTabs: NavigatorScreenParams<RootTabParamList>;
  VideoPlayer: undefined;
  Profile: { username: string };
};
