export interface NotificationResponse {
  id: number;

  customerId: number;

  title?: string;

  message: string;

  isRead: boolean;

  createdAt: string;
}