import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseEventFormComponent } from '../base-event-form/base-event-form.component';

@Component({
  selector: 'app-sport-event-form',
  templateUrl: './sport-event-form.component.html',
  styleUrl: './sport-event-form.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportEventFormComponent extends BaseEventFormComponent {
  numberOfParticipants = input();
}
