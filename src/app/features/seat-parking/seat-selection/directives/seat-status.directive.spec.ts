import {
  ElementRef,
  Renderer2
} from '@angular/core';

import { SeatStatusDirective } from './seat-status.directive';

describe('SeatStatusDirective', () => {
  it('should create an instance', () => {
    const nativeElement = document.createElement('button');

    const elementRef =
      new ElementRef(nativeElement);

    const renderer = {
      setAttribute: jasmine.createSpy('setAttribute')
    } as unknown as Renderer2;

    const directive =
      new SeatStatusDirective(
        elementRef,
        renderer
      );

    expect(directive).toBeTruthy();
  });

  it('should apply available seat status attributes', () => {
    const nativeElement = document.createElement('button');

    const elementRef =
      new ElementRef(nativeElement);

    const renderer = {
      setAttribute: jasmine.createSpy('setAttribute')
    } as unknown as Renderer2;

    const directive =
      new SeatStatusDirective(
        elementRef,
        renderer
      );

    directive.appSeatStatus = 'Available';
    directive.ngOnChanges();

    expect(renderer.setAttribute)
      .toHaveBeenCalledWith(
        nativeElement,
        'data-seat-status',
        'available'
      );

    expect(renderer.setAttribute)
      .toHaveBeenCalledWith(
        nativeElement,
        'aria-label',
        'Seat status: Available'
      );
  });
});
