import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import tw from '../lib/tw';
import { Avatar, BottomNavigationProps } from 'react-native-paper';
import React from 'react'
import { useAuthStore } from '../store/authStore';
import { formatDistanceToNow } from 'date-fns';
import { useCommentLikes } from '../hooks/useLikes';
import { useCommentToggleLike } from '../hooks/useLikes';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, RootTabParamList } from '../types/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';


type CommentsProps = {
    comment: any;
    isEditing: boolean;
    updatedText: string;
    setUpdatedText: (text: string) => void;
    setEditingCommentId: (id: string | null) => void;
    onUpdate: () => void;
    onDelete: () => void;
}

type NavProp = CompositeNavigationProp<
NativeStackNavigationProp<RootStackParamList>,
BottomTabNavigationProp<RootTabParamList>
>;

const Comments = ({
    comment,
    isEditing,
    updatedText,
    setUpdatedText,
    setEditingCommentId,
    onUpdate,
    onDelete
}: CommentsProps) => {

    const {user} = useAuthStore();
    const isMyComment = comment.owner._id === user?._id
    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    console.log(comment)

    const {data: Clikes} = useCommentLikes(comment._id);
    const {mutate: toggleCLike} = useCommentToggleLike(comment._id);

    const navigation = useNavigation<NavProp>();
    
    return (
        <View
          key={comment._id}
          style={tw`flex-row items-start space-x-3 mb-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg`}
        >
          {/* Avatar */}
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { username: comment.owner.username })} >
            <Avatar.Image 
            size={40} 
            source={{ uri: comment.owner.avatar }} 
            style={tw`mr-4 justify-center items-center`}
            />
          </TouchableOpacity>
    
          {/* Right section */}
          <View style={tw`flex-1`}>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`font-semibold text-black dark:text-white`}>
                {comment.owner.username}
              </Text>
              <View style={tw`flex-col items-center`}>
                <Text style={tw`text-xs text-gray-500`}>{timeAgo}</Text>
                <TouchableOpacity style={tw`flex-row items-center`} onPress={() => toggleCLike()} >
                  <Ionicons name="thumbs-up-outline" size={16} color="black" />
                  <Text style={tw`text-s text-black dark:text-white`}>Like ({Clikes?.NoOfLikesOnComment})</Text>
                </TouchableOpacity>
              </View>
              
              
            </View>
    
            {isEditing ? (
              <View style={tw`mt-2`}>
                <TextInput
                  value={updatedText}
                  onChangeText={setUpdatedText}
                  style={tw`border border-gray-400 p-2 rounded text-black dark:text-white`}
                  multiline
                />
                <View style={tw`flex-row mt-2 space-x-2`}>
                  <TouchableOpacity
                    style={tw`bg-blue-500 px-3 py-1 rounded`}
                    onPress={onUpdate}
                  >
                    <Text style={tw`text-white`}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`bg-gray-400 px-3 py-1 rounded`}
                    onPress={() => setEditingCommentId(null)}
                  >
                    <Text style={tw`text-white`}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={tw`text-black dark:text-white mt-1`}>
                {comment.content}
              </Text>
            )}
    
                                              {/* Edit + Delete controls */}
            {isMyComment && !isEditing && (
            <View style={tw`flex-row mt-3 space-x-4 items-center`}>
                <TouchableOpacity
                style={tw`p-2 rounded-full bg-blue-100 mr-2  `}
                onPress={() => {
                    setEditingCommentId(comment._id)
                    setUpdatedText(comment.content)
                }}
                >
                <Feather name="edit-2" size={16} color="#2563eb" />
                </TouchableOpacity>
    
                <TouchableOpacity
                style={tw`p-2 rounded-full bg-red-100`}
                onPress={onDelete}
                >
                <MaterialIcons name="delete-outline" size={18} color="#dc2626" />
                </TouchableOpacity>
            </View>
            )}
          </View>
          
        </View>
      )
}

export default Comments