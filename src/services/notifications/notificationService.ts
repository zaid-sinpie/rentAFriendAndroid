import { AppNotification } from '../../types';
import { mockNotifications } from '../../mocks/mockNotifications';
import { simulateNetworkDelay } from '../api/apiClient';

class NotificationService {
  private notifications: AppNotification[] = [...mockNotifications];

  async getNotifications(): Promise<AppNotification[]> {
    await simulateNetworkDelay(250);
    return [...this.notifications];
  }

  async markAsRead(id: string): Promise<void> {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
    }
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach((n) => (n.isRead = true));
  }

  async addNotification(item: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>): Promise<AppNotification> {
    const newNotif: AppNotification = {
      ...item,
      id: `notif_${Date.now()}`,
      isRead: false,
      createdAt: 'Just now',
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }
}

export const notificationService = new NotificationService();
