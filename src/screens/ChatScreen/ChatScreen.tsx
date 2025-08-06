import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { spacing, typography, borderRadius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import NotificationService from '../../services/NotificationService';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Get chat data from navigation params
  const chatData = (route.params as any)?.chat || { 
    name: 'Unknown Contact',
    avatar: '👤'
  };

  useEffect(() => {
    // Load initial messages (mock data)
    const initialMessages: Message[] = [
      {
        id: '1',
        text: 'Hey there! How are you doing?',
        timestamp: new Date(Date.now() - 3600000),
        isUser: false,
        status: 'read',
      },
      {
        id: '2',
        text: 'I\'m doing great, thanks for asking! What about you?',
        timestamp: new Date(Date.now() - 3500000),
        isUser: true,
        status: 'read',
      },
      {
        id: '3',
        text: 'That\'s wonderful to hear! I\'m doing well too.',
        timestamp: new Date(Date.now() - 3400000),
        isUser: false,
        status: 'read',
      },
      {
        id: '4',
        text: 'Are we still on for our meeting tomorrow?',
        timestamp: new Date(Date.now() - 3300000),
        isUser: true,
        status: 'delivered',
      },
    ];
    setMessages(initialMessages);
  }, []);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date(),
      isUser: true,
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Animate message entry
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 2000);

    // Simulate other user typing and responding
    setTimeout(() => {
      setIsTyping(true);
    }, 3000);

    setTimeout(async () => {
      setIsTyping(false);
      const responses = [
        'Yes, absolutely! Looking forward to it.',
        'Of course! See you then.',
        'Sure thing! Can\'t wait.',
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        timestamp: new Date(),
        isUser: false,
        status: 'read',
      };

      // Show notification if app is not focused on this chat
      if (!navigation.isFocused()) {
        await NotificationService.showMessageNotification(
          chatData.name,
          response,
          chatData.avatar
        );
      }
      
      setMessages(prev => [...prev, responseMessage]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 5000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return 'time-outline';
      case 'sent':
        return 'checkmark-outline';
      case 'delivered':
        return 'checkmark-done-outline';
      case 'read':
        return 'checkmark-done-outline';
      default:
        return 'time-outline';
    }
  };

  // Create animations refs at the component level
  const slideAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
  const opacityAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  // Function to get or create animations for a message
  const getMessageAnimations = (messageId: string, index: number) => {
    if (!slideAnimations[messageId]) {
      slideAnimations[messageId] = new Animated.Value(50);
      opacityAnimations[messageId] = new Animated.Value(0);
      
      Animated.parallel([
        Animated.timing(slideAnimations[messageId], {
          toValue: 0,
          duration: 300,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimations[messageId], {
          toValue: 1,
          duration: 300,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
    return {
      slideAnim: slideAnimations[messageId],
      opacityAnim: opacityAnimations[messageId],
    };
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const { slideAnim, opacityAnim } = getMessageAnimations(item.id, index);

    return (
      <Animated.View
        style={[
          styles.messageContainer,
          item.isUser ? styles.userMessageContainer : styles.otherMessageContainer,
          {
            opacity: opacityAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            item.isUser ? styles.userBubble : styles.otherBubble,
            {
              backgroundColor: item.isUser ? colors.primary : colors.surface,
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: item.isUser ? colors.textLight : colors.text },
            ]}
          >
            {item.text}
          </Text>
        </View>
        <View style={styles.messageInfo}>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
          {item.isUser && (
            <Ionicons
              name={getStatusIcon(item.status)}
              size={16}
              color={
                item.status === 'read' ? colors.primary : colors.textSecondary
              }
              style={styles.statusIcon}
            />
          )}
        </View>
      </Animated.View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.otherMessageContainer]}>
        <View style={[styles.messageBubble, styles.otherBubble, styles.typingBubble]}>
          <View style={styles.typingDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.contactAvatar}>{chatData.avatar}</Text>
            <View style={styles.contactDetails}>
              <Text style={styles.contactName}>{chatData.name}</Text>
              <Text style={styles.onlineStatus}>Online</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderTypingIndicator}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={[
                styles.sendButton,
                { backgroundColor: inputText.trim() ? colors.primary : colors.inactive },
              ]}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  contactAvatar: {
    fontSize: 32,
    width: 48,
    height: 48,
    textAlign: 'center',
    lineHeight: 48,
    borderRadius: borderRadius.round,
    marginRight: spacing.md,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    ...typography.body,
    fontWeight: '600',
  },
  onlineStatus: {
    ...typography.small,
  },
  menuButton: {
    padding: spacing.sm,
  },
  messagesList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.xl,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    maxWidth: '100%',
    minHeight: 40,
  },
  userBubble: {
    borderBottomRightRadius: 4,
    backgroundColor: '#2196F3',
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
    backgroundColor: '#F5F5F5',
  },
  messageText: {
    ...typography.body,
    lineHeight: 20,
    fontSize: 16,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  timestamp: {
    ...typography.small,
    fontSize: 12,
    color: '#666666',
  },
  statusIcon: {
    marginLeft: 4,
  },
  typingBubble: {
    paddingVertical: spacing.md,
    backgroundColor: '#F5F5F5',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
    backgroundColor: '#666666',
  },
  inputContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: borderRadius.xxl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#F5F5F5',
  },
  textInput: {
    flex: 1,
    ...typography.body,
    maxHeight: 100,
    marginRight: spacing.sm,
    fontSize: 16,
    color: '#000000',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196F3',
  },
});

export default ChatScreen;
