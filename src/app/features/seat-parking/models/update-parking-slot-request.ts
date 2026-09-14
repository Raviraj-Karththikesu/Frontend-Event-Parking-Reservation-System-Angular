export interface UpdateParkingSlotRequest {
  slotNumber: string;
  zone?: string | null;
  fee: number;
}
