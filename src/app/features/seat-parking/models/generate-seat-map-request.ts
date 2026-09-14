export interface GenerateSeatMapRequest {
  rows: number;
  columns: number;
  seatType?: string | null;
  price: number;
}
