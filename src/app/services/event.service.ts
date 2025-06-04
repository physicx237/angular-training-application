import { Injectable, signal } from '@angular/core';
import { Event } from '../interfaces/event.interface';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly events = signal<Event[]>([]);

  getEvents() {
    return this.events.asReadonly();
  }

  getEventById(id: number) {
    const events = this.events();

    const event = events.find((item) => item.id === id);

    return signal(event);
  }

  addEvent(event: Omit<Event, 'id'>) {
    this.events.update((value) => {
      const newEventId = value[value.length - 1]?.id + 1 || 0;

      const newEvent: Event = {
        id: newEventId,
        ...event,
      };

      return [...value, newEvent];
    });
  }

  editEvent(event: Event) {
    this.events.update((value) =>
      value.map((item) => (item.id === event.id ? event : item))
    );
  }

  removeEvent(id: number) {
    this.events.update((value) => value.filter((item) => item.id !== id));
  }
}
