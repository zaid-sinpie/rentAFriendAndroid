import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Booking, AppNotification } from '../types';
import { authService, defaultMockUser } from '../services/auth/authService';
import { bookingService } from '../services/bookings/bookingService';
import { notificationService } from '../services/notifications/notificationService';
import { storage } from '../services/storage/storage';
import { MainTabType } from '../components/common/BottomTabBar';

export type AppNavScreen =
  | 'splash'
  | 'welcome'
  | 'login'
  | 'signup'
  | 'otp'
  | 'role_intro'
  | 'main'
  | 'friend_detail'
  | 'booking_flow'
  | 'booking_detail'
  | 'chat'
  | 'become_friend'
  | 'provider_dashboard'
  | 'manage_availability'
  | 'edit_profile'
  | 'favorites'
  | 'settings'
  | 'community_guidelines'
  | 'safety'
  | 'legal'
  | 'notifications'
  | 'write_review';

interface ToastState {
  visible: boolean;
  type?: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  currentScreen: AppNavScreen;
  activeTab: MainTabType;
  selectedFriendId: string | null;
  selectedBookingId: string | null;
  activeChat: {
    conversationId: string;
    participantId: string;
    participantName: string;
    participantAvatar: string;
  } | null;
  favorites: string[];
  bookings: Booking[];
  notifications: AppNotification[];
  toast: ToastState;
  screenHistory: AppNavScreen[];

  // Actions
  navigateTo: (screen: AppNavScreen, params?: { friendId?: string; bookingId?: string; chat?: any }) => void;
  goBack: () => boolean;
  setActiveTab: (tab: MainTabType) => void;
  toggleFavorite: (friendId: string) => void;
  isFavorite: (friendId: string) => boolean;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  showToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  hideToast: () => void;
  refreshBookings: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  registerAsProvider: (providerData: any) => Promise<void>;
}

const FAVORITES_KEY = 'user_favorite_friends';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(defaultMockUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<AppNavScreen>('main');
  const [activeTab, setActiveTabState] = useState<MainTabType>('home');
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<{
    conversationId: string;
    participantId: string;
    participantName: string;
    participantAvatar: string;
  } | null>(null);

  const [favorites, setFavorites] = useState<string[]>(['friend_1', 'friend_2']);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [screenHistory, setScreenHistory] = useState<AppNavScreen[]>(['main']);

  const [toast, setToast] = useState<ToastState>({
    visible: false,
    title: '',
  });

  // Load favorites & initial data on mount
  useEffect(() => {
    const init = async () => {
      try {
        const storedFavs = await storage.getItem(FAVORITES_KEY);
        if (storedFavs) {
          setFavorites(JSON.parse(storedFavs));
        }
        const bks = await bookingService.getBookings();
        setBookings(bks);
        const notifs = await notificationService.getNotifications();
        setNotifications(notifs);
      } catch {
        // ignore
      }
    };
    init();
  }, []);

  const showToast = (
    title: string,
    message?: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info'
  ) => {
    setToast({ visible: true, title, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const navigateTo = (
    screen: AppNavScreen,
    params?: { friendId?: string; bookingId?: string; chat?: any }
  ) => {
    if (params?.friendId) setSelectedFriendId(params.friendId);
    if (params?.bookingId) setSelectedBookingId(params.bookingId);
    if (params?.chat) setActiveChat(params.chat);

    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const goBack = (): boolean => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // remove current
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen);
      return true; // handled
    }
    return false; // let hardware back exit app if on root
  };

  const setActiveTab = (tab: MainTabType) => {
    setActiveTabState(tab);
    if (currentScreen !== 'main') {
      setCurrentScreen('main');
      setScreenHistory(['main']);
    }
  };

  const toggleFavorite = async (friendId: string) => {
    const exists = favorites.includes(friendId);
    const updated = exists
      ? favorites.filter((id) => id !== friendId)
      : [...favorites, friendId];

    setFavorites(updated);
    await storage.setItem(FAVORITES_KEY, JSON.stringify(updated));

    showToast(
      exists ? 'Removed from favorites' : 'Saved to favorites',
      exists ? 'Friend removed from your saved list' : 'Friend added to your saved list',
      'success'
    );
  };

  const isFavorite = (friendId: string) => favorites.includes(friendId);

  const loginUser = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    navigateTo('main');
    showToast('Welcome back!', `Signed in as ${user.fullName}`, 'success');
  };

  const logoutUser = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigateTo('welcome');
    showToast('Logged out', 'You have been signed out safely', 'info');
  };

  const updateUser = async (updates: Partial<User>) => {
    const updated = await authService.updateProfile(updates);
    setCurrentUser(updated);
    showToast('Profile updated', 'Your profile details have been saved', 'success');
  };

  const refreshBookings = async () => {
    const bks = await bookingService.getBookings();
    setBookings(bks);
  };

  const refreshNotifications = async () => {
    const notifs = await notificationService.getNotifications();
    setNotifications(notifs);
  };

  const registerAsProvider = async (providerData: any) => {
    if (currentUser) {
      await updateUser({ hasFriendProfile: true });
    }
    await refreshBookings();
    showToast(
      'Friend Profile Submitted!',
      'Your companionship profile is now active in demo mode',
      'success'
    );
    navigateTo('provider_dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        currentScreen,
        activeTab,
        selectedFriendId,
        selectedBookingId,
        activeChat,
        favorites,
        bookings,
        notifications,
        toast,
        screenHistory,
        navigateTo,
        goBack,
        setActiveTab,
        toggleFavorite,
        isFavorite,
        loginUser,
        logoutUser,
        updateUser,
        showToast,
        hideToast,
        refreshBookings,
        refreshNotifications,
        registerAsProvider,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
