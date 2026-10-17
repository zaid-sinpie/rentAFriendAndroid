import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppContext';
import { messageService } from '../../services/messages/messageService';
import { Conversation } from '../../types';
import { Avatar } from '../../components/ui/Avatar';
import { EmptyState } from '../../components/common/EmptyState';

export const MessagesScreen: React.FC = () => {
  const { colors, typography, borderRadius } = useTheme();
  const { navigateTo, setActiveTab } = useApp();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const list = await messageService.getConversations();
      setConversations(list);
    } catch {
      // error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadConversations();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[typography.pageTitle, { color: colors.text }]}>
            Messages
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>
            Direct communication with your booked companions
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {conversations.length === 0 ? (
            <EmptyState
              icon={<MessageSquare size={32} color={colors.textSecondary} />}
              title="No messages yet"
              description="When you book a companion, you can communicate safely here to align on public meeting points."
              actionTitle="Discover Companions"
              onActionPress={() => setActiveTab('explore')}
            />
          ) : (
            conversations.map((conv) => (
              <TouchableOpacity
                key={conv.id}
                activeOpacity={0.75}
                onPress={() => {
                  navigateTo('chat', {
                    chat: {
                      conversationId: conv.id,
                      participantId: conv.participantId,
                      participantName: conv.participantName,
                      participantAvatar: conv.participantAvatar,
                    },
                  });
                }}
                style={[
                  styles.conversationCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: borderRadius.lg,
                  },
                ]}
              >
                <Avatar
                  source={conv.participantAvatar}
                  name={conv.participantName}
                  size={52}
                  isOnline={conv.isOnline}
                />

                <View style={styles.conversationInfo}>
                  <View style={styles.topRow}>
                    <Text style={[typography.sectionTitle, { color: colors.text, fontSize: 16 }]}>
                      {conv.participantName}
                    </Text>
                    <Text style={[typography.caption, { color: colors.textMuted }]}>
                      {conv.lastTimestamp}
                    </Text>
                  </View>

                  <View style={styles.bottomRow}>
                    <Text
                      numberOfLines={1}
                      style={[
                        typography.caption,
                        {
                          color: conv.unreadCount > 0 ? colors.text : colors.textSecondary,
                          fontWeight: conv.unreadCount > 0 ? '700' : '400',
                          flex: 1,
                        },
                      ]}
                    >
                      {conv.lastMessage}
                    </Text>

                    {conv.unreadCount > 0 && (
                      <View
                        style={[
                          styles.unreadBadge,
                          { backgroundColor: colors.primary, borderRadius: borderRadius.full },
                        ]}
                      >
                        <Text style={{ color: colors.white, fontSize: 10, fontWeight: '800' }}>
                          {conv.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 10,
  },
  scrollList: {
    paddingBottom: 36,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    marginVertical: 5,
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginLeft: 8,
  },
});
