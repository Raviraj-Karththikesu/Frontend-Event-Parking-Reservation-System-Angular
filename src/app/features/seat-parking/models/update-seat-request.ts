export interface UpdateSeatRequest {
  seatNumber: string;
  rowLabel?: string | null;
  seatType?: string | null;
  price: number;
}
