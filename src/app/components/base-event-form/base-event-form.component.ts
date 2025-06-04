import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-base-event-form',
  templateUrl: './base-event-form.component.html',
  styleUrl: './base-event-form.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseEventFormComponent {
  name = input();
  description = input();
  location = input();
  isShowForm = input();
}
