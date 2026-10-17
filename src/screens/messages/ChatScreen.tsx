import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Send, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { messageService } from '../../services/messages/messageService';
import { Message } from '../../types';
import { AppHeader } from '../../components/common/AppHeader';
import { Avatar } from '../../components/ui/Avatar';

export const ChatScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { activeChat, goBack } = useApp();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  const participantName = activeChat?.participantName || 'Companion';
  const participantAvatar = activeChat?.participantAvatar;
  const conversationId = activeChat?.conversationId || 'conv_1';
  const participantId = activeChat?.participantId || 'friend_1';

  const loadMessages = async () => {
    const list = await messageService.getMessages(conversationId);
    setMessages(list);
  };

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const textToSend = inputText.trim();
    setInputText('');

    const newMsg = await messageService.sendMessage({
      conversationId,
      text: textToSend,
      receiverId: participantId,
    });

    setMessages((prev) => [...prev, newMsg]);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulated auto-reply after 1.5 seconds for interactive realism!
    setTimeout(async () => {
      const autoReply = await messageService.sendMessage({
        conversationId,
        text: `Thanks for the update! Looking forward to meeting at the agreed public venue.`,
        receiverId: 'user_current',
      });
      // override sender as participant for demo realism
      autoReply.senderId = participantId;
      setMessages((prev) => [...prev, autoReply]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AppHeader
        title={participantName}
        subtitle="Active Companion"
        showBack
        onBack={goBack}
        rightAction={
          <Avatar source={participantAvatar} name={participantName} size={36} isOnline />
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Safety Disclaimer Banner */}
        <View
          style={[
            styles.safetyBanner,
            { backgroundColor: colors.surfaceSubtle, borderBottomColor: colors.border },
          ]}
        >
          <ShieldCheck size={14} color={colors.success} style={{ marginRight: 6 }} />
          <Text style={[typography.small, { color: colors.textSecondary, flex: 1 }]}>
            Keep all conversations respectful. Meetings must take place at public venues.
          </Text>
        </View>

        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {messages.map((msg) => {
            const isMe = msg.senderId === 'user_current';

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubbleWrapper,
                  isMe ? styles.myMessageWrapper : styles.otherMessageWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    {
                      backgroundColor: isMe ? colors.primary : colors.card,
                      borderColor: isMe ? colors.primary : colors.border,
                      borderRadius: borderRadius.lg,
                      borderBottomRightRadius: isMe ? 2 : borderRadius.lg,
                      borderBottomLeftRadius: !isMe ? 2 : borderRadius.lg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.body,
                      { color: isMe ? colors.white : colors.text, fontSize: 14.5 },
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <Text
                    style={[
                      typography.small,
                      styles.timestamp,
                      { color: isMe ? 'rgba(255,255,255,0.75)' : colors.textMuted },
                    ]}
                  >
                    {msg.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input Composer */}
        <View
          style={[
            styles.composer,
            { backgroundColor: colors.card, borderTopColor: colors.border },
          ]}
        >
          <TextInput
            placeholder="Type your message..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            style={[
              styles.input,
              typography.body,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.border,
                borderRadius: borderRadius.full,
                color: colors.text,
              },
            ]}
          />

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleSend}
            disabled={!inputText.trim()}
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() ? colors.primary : colors.surfaceSubtle,
                borderRadius: borderRadius.full,
              },
            ]}
          >
            <Send size={18} color={inputText.trim() ? colors.white : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubbleWrapper: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
  },
  otherMessageWrapper: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
