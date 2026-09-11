import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'app-loading-state',
  templateUrl:
'./loading-state.component.html',
  changeDetection:
    ChangeDetectionStrategy.OnPush
})
export class LoadingStateComponent {
  @Input()
  message = 'Loading, please wait...';
}