import { Platform } from 'react-native';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    this.createDefaultChannel();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async createDefaultChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      await notifee.createChannel({
        id: 'messages',
        name: 'Messages',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });
    }
  }

  async showNotification(
    title: string,
    body: string,
    data?: any,
    imageUrl?: string,
  ) {
    try {
      const channelId = Platform.OS === 'android' ? 'default' : undefined;

      await notifee.displayNotification({
        title,
        body,
        data,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          style: imageUrl ? {
            type: AndroidStyle.BIGPICTURE,
            picture: imageUrl,
          } : undefined,
        },
        ios: {
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          },
          attachments: imageUrl ? [{
            url: imageUrl,
          }] : undefined,
        },
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  async showMessageNotification(
    senderName: string,
    message: string,
    avatar?: string,
  ) {
    try {
      const channelId = Platform.OS === 'android' ? 'messages' : undefined;

      await notifee.displayNotification({
        title: senderName,
        body: message,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          style: {
            type: AndroidStyle.MESSAGING,
            person: {
              name: senderName,
              icon: avatar || 'https://my-cdn.com/avatars/default.png',
            },
            messages: [
              {
                text: message,
                timestamp: Date.now(),
                person: {
                  name: senderName,
                  icon: avatar || 'https://my-cdn.com/avatars/default.png',
                },
              },
            ],
          },
        },
        ios: {
          foregroundPresentationOptions: {
            alert: true,
            badge: true,
            sound: true,
          },
          threadId: 'messages',
        },
      });
    } catch (error) {
      console.error('Error showing message notification:', error);
    }
  }

  async scheduleNotification(
    title: string,
    body: string,
    timestamp: Date,
    data?: any,
  ) {
    try {
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: timestamp.getTime(),
      };

      await notifee.createTriggerNotification(
        {
          title,
          body,
          data,
          android: {
            channelId: 'default',
            importance: AndroidImportance.HIGH,
            pressAction: {
              id: 'default',
            },
          },
          ios: {
            foregroundPresentationOptions: {
              alert: true,
              badge: true,
              sound: true,
            },
          },
        },
        trigger,
      );
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async cancelAllNotifications() {
    await notifee.cancelAllNotifications();
  }

  async getBadgeCount(): Promise<number> {
    return await notifee.getBadgeCount();
  }

  async setBadgeCount(count: number) {
    await notifee.setBadgeCount(count);
  }

  async incrementBadgeCount() {
    const currentCount = await this.getBadgeCount();
    await this.setBadgeCount(currentCount + 1);
  }

  async decrementBadgeCount() {
    const currentCount = await this.getBadgeCount();
    if (currentCount > 0) {
      await this.setBadgeCount(currentCount - 1);
    }
  }
}

export default NotificationService.getInstance();