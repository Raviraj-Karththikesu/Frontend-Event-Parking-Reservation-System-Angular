export interface BookingSelection {
  eventId: number | null;
  seatIds: number[];
  parkingSlotId: number | null;
  ticketTotal: number;
  parkingFee: number;
  grandTotal: number;
}