import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl:
'./confirmation-dialog.component.html',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {
  @Input()
  isOpen = false;

  @Input()
  title = 'Confirm action';

  @Input()
  message =
    'Are you sure you want to continue?';

  @Input()
  confirmLabel = 'Confirm';

  @Input()
  cancelLabel = 'Cancel';

  @Input()
  danger = false;

  @Input()
  isProcessing = false;

  @Output()
  readonly confirmed =
    new EventEmitter<void>();

  @Output()
  readonly cancelled =
    new EventEmitter<void>();

  confirm(): void {
    if (this.isProcessing) {
      return;
    }

    this.confirmed.emit();
  }

  cancel(): void {
    if (this.isProcessing) {
      return;
    }

    this.cancelled.emit();
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  @HostListener(
    'document:keydown.escape'
  )
  handleEscape(): void {
    if (this.isOpen) {
      this.cancel();
    }
  }
}