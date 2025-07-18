// types.ts
import { NavigatorScreenParams } from '@react-navigation/native';
import { Video } from './video';

export type RootTabParamList = {
  Home: undefined;
  Upload: {videoData?: Video} | undefined;
  MyProfile: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  AppTabs: NavigatorScreenParams<RootTabParamList>;
  VideoPlayer: undefined;
  Profile: { username: string };
};
