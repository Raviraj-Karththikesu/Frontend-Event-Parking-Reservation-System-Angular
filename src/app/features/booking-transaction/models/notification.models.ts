export interface NotificationResponse {
  id?: number;

  notificationId?: number;

  customerId: number;

  type?: string | number;

  title?: string;

  message: string;

  isRead: boolean;

  createdAt: string;
}