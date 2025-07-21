// types.ts
import { NavigatorScreenParams } from '@react-navigation/native';
import { Video } from './video';

export type RootTabParamList = {
  Home: undefined;
  Dashboard: undefined;
  Playlist: undefined;
  Upload: {videoData?: Video} | undefined;
  MyProfile: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  PlaylistDetail: { playlistId: string };
  AppTabs: NavigatorScreenParams<RootTabParamList>;
  VideoPlayer: undefined;
  Settings: undefined;
  Profile: { username: string };
};
