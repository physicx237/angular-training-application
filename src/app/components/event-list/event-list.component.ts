import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { EventService } from '../../services/event.service';
import { Event } from '../../interfaces/event.interface';
import { EventType } from '../../types/event.type';

interface EventTypeOption {
  name: string;
  value: EventType;
}

@Component({
  selector: 'app-event-list',
  imports: [TableModule, ButtonModule, SelectModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  events!: Signal<Event[]>;

  eventTypes: EventTypeOption[] = [
    {
      name: 'Стандартное событие',
      value: 'base',
    },
    {
      name: 'Спортивное событие',
      value: 'sport',
    },
    {
      name: 'Музыкальное событие',
      value: 'music',
    },
  ];

  ngOnInit() {
    this.events = this.eventService.getEvents();
  }

  addEvent(eventType: 'base' | 'sport' | 'music') {
    this.router.navigate(['../event-editor'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        mode: 'add',
        type: eventType,
      },
    });
  }

  editEvent(id: number) {
    this.router.navigate(['../event-editor', id], {
      relativeTo: this.activatedRoute,
      queryParams: {
        mode: 'edit',
      },
    });
  }

  removeEvent(id: number) {
    this.eventService.removeEvent(id);
  }
}
