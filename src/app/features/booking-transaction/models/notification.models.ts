export interface NotificationResponse {
  id?: number;

  notificationId?: number;

  customerId: number;

  type?: string;

  title?: string;

  message: string;

  isRead: boolean;

  createdAt: string;
}