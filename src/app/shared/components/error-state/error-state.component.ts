import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl:'./error-state.component.html',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ErrorStateComponent {
  @Input()
  title = 'Unable to load information';

  @Input()
  message =
    'Something went wrong. Please try again.';

  @Input()
  showRetry = true;

  @Output()
  readonly retry = new EventEmitter<void>();

  retryRequest(): void {
    this.retry.emit();
  }
}