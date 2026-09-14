import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appSeatStatus]',
  standalone: true
})
export class SeatStatusDirective implements OnChanges {

  @Input() appSeatStatus = '';

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnChanges(): void {
    const status = this.appSeatStatus.toLowerCase();

    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'data-seat-status',
      status
    );

    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'aria-label',
      `Seat status: ${this.getStatusText(status)}`
    );
  }

  private getStatusText(status: string): string {
    switch (status) {
      case 'available':
        return 'Available';

      case 'held':
        return 'Held';

      case 'reserved':
      case 'booked':
        return 'Reserved';

      case 'selected':
        return 'Selected';

      default:
        return 'Unavailable';
    }
  }
}
