import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BaseEventFormComponent } from '../base-event-form/base-event-form.component';

@Component({
  selector: 'app-music-event-form',
  templateUrl: './music-event-form.component.html',
  styleUrl: './music-event-form.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicEventFormComponent extends BaseEventFormComponent {
  genre = input();
}
