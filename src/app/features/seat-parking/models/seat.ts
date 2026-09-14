export interface Seat {
  id: number;
  eventId: number;
  seatNumber: string;
  rowLabel: string | null;
  seatType: string | null;
  price: number;
  status: string;
}