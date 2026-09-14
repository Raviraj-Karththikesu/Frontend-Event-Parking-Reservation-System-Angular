import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bookingStatus',
  standalone: true
})
export class BookingStatusPipe
  implements PipeTransform {

  transform(value: string | null | undefined): string {

    if (!value) {
      return 'Unknown';
    }

    switch (value.toLowerCase()) {

      case 'pending':
        return 'Pending Payment';

      case 'confirmed':
        return 'Confirmed';

      case 'cancelled':
        return 'Cancelled';

      case 'expired':
        return 'Expired';

      default:
        return value;
    }
  }
}