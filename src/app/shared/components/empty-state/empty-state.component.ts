import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl:'./empty-state.component.html',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  @Input()
  title = 'No information found';

  @Input()
  message =
    'There is currently no information to display.';

  @Input()
  actionLabel = 'Create new';

  @Input()
  showAction = false;

  @Output()
  readonly action = new EventEmitter<void>();

  performAction(): void {
    this.action.emit();
  }
}