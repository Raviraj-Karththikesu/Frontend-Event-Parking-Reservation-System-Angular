import { Pipe, PipeTransform } from '@angular/core';
import { Seat } from '../../../models/seat';

@Pipe({
  name: 'seatLabel',
  standalone: true
})
export class SeatLabelPipe implements PipeTransform {

  transform(seat: Seat | null | undefined): string {
    if (!seat) {
      return '';
    }

    if (seat.rowLabel) {
      return `${seat.rowLabel} - ${seat.seatNumber}`;
    }

    return seat.seatNumber;
  }
}
