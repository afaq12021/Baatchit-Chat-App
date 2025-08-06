import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { spacing, typography, borderRadius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { toggleFavorite, setActiveChat } from '../../redux/slices/chatSlice';
import { StorageService } from '../../utils/storage';

const { width } = Dimensions.get('window');

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unreadCount: number;
  isFavorite: boolean;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you doing?',
    timestamp: '2m ago',
    avatar: '👨‍💼',
    unreadCount: 2,
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    lastMessage: 'Thanks for the help today!',
    timestamp: '10m ago',
    avatar: '👩‍💻',
    unreadCount: 0,
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Team Group',
    lastMessage: 'Meeting at 3 PM tomorrow',
    timestamp: '1h ago',
    avatar: '👥',
    unreadCount: 5,
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Mom',
    lastMessage: 'Don\'t forget to call grandma',
    timestamp: '2h ago',
    avatar: '👩‍🦳',
    unreadCount: 1,
    isFavorite: true,
  },
  {
    id: '5',
    name: 'Alex Johnson',
    lastMessage: 'The project looks great!',
    timestamp: '1d ago',
    avatar: '👨‍🎨',
    unreadCount: 0,
    isFavorite: false,
  },
];

const ChatsScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { chats, favorites } = useAppSelector((state) => state.chat);

  useEffect(() => {
    // Save favorites to storage when they change
    StorageService.saveFavorites(favorites);
  }, [favorites]);

  const handleToggleFavorite = (chatId: string) => {
    dispatch(toggleFavorite(chatId));
  };

  const openChat = (chat: any) => {
    dispatch(setActiveChat(chat));
    (navigation as any).navigate('chat', { chat });
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={[styles.chatItem, { borderBottomColor: colors.border }]}
      onPress={() => openChat(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Text style={[styles.avatar, { backgroundColor: colors.inputBackground }]}>{item.avatar}</Text>
        {item.unreadCount > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: '#25D366' }]}>
            <Text style={styles.unreadText}>
              {item.unreadCount > 99 ? '99+' : item.unreadCount}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: colors.text }]}>{item.name}</Text>
          <View style={styles.rightSection}>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{item.timestamp}</Text>
            <TouchableOpacity
              onPress={() => handleToggleFavorite(item.id)}
              style={styles.favoriteButton}
            >
              <Ionicons
                name={item.isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={item.isFavorite ? colors.accent : colors.inactive}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.lastMessage, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Chats</Text>
      </View>
      
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    ...typography.h2,
    fontSize: 20,
    fontWeight: '600',
  },
  chatsList: {
    padding: 0,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    fontSize: 32,
    width: 50,
    height: 50,
    textAlign: 'center',
    lineHeight: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    ...typography.body,
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 2,
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  timestamp: {
    ...typography.small,
    fontSize: 12,
    marginBottom: 2,
  },
  favoriteButton: {
    display: 'none', 
  },
  lastMessage: {
    ...typography.caption,
    fontSize: 14,
  },
});

export default ChatsScreen;