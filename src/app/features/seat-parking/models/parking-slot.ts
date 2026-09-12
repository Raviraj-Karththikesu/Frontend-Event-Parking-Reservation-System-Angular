export interface ParkingSlot {
  id: number;
  eventId: number;
  slotNumber: string;
  zone: string | null;
  fee: number;
  status: string;
}