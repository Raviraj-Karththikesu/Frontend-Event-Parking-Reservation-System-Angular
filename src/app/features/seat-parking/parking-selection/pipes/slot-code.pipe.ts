import { Pipe, PipeTransform } from '@angular/core';
import { ParkingSlot } from '../../models/parking-slot';

@Pipe({
  name: 'slotCode',
  standalone: true
})
export class SlotCodePipe implements PipeTransform {

  transform(slot: ParkingSlot | null | undefined): string {
    if (!slot) {
      return '';
    }

    if (slot.zone) {
      return `${slot.zone} - ${slot.slotNumber}`;
    }

    return slot.slotNumber;
  }
}
