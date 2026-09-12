export interface GenerateParkingLayoutRequest {
  totalSlots: number;
  zone?: string | null;
  fee: number;
}
