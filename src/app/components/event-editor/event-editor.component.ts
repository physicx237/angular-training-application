import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EventService } from '../../services/event.service';
import { BaseEventFormComponent } from '../base-event-form/base-event-form.component';
import { SportEventFormComponent } from '../sport-event-form/sport-event-form.component';
import { MusicEventFormComponent } from '../music-event-form/music-event-form.component';
import { Event } from '../../interfaces/event.interface';
import { EventType } from '../../types/event.type';

@Component({
  selector: 'app-event-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    ToastModule,
    BaseEventFormComponent,
    SportEventFormComponent,
    MusicEventFormComponent,
  ],
  providers: [MessageService],
  templateUrl: './event-editor.component.html',
  styleUrl: './event-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventEditorComponent implements OnInit {
  private eventId!: number | null;
  private mode!: 'add' | 'edit';

  private readonly eventService = inject(EventService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  eventType!: EventType;

  eventData!: Event | undefined;

  isShowForm = false;

  eventForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(255),
    ]),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(255),
    ]),
    location: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(255),
    ]),
    numberOfParticipants: new FormControl<number | null>(null, [
      Validators.required,
    ]),
    genre: new FormControl<string>('', [
      Validators.minLength(1),
      Validators.maxLength(255),
    ]),
  });

  get isFormNotEmpty() {
    return Object.values(this.eventForm.value).some((item) => !!item);
  }

  ngOnInit() {
    combineLatest({
      paramMap: this.activatedRoute.paramMap,
      queryParamMap: this.activatedRoute.queryParamMap,
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ paramMap, queryParamMap }) => {
        this.eventId = paramMap.get('id')
          ? +(paramMap.get('id') as string)
          : null;

        this.mode = queryParamMap.get('mode') as 'add' | 'edit';

        this.isShowForm = this.mode === 'add';

        this.eventType = queryParamMap.get('type') as EventType;

        if (this.mode === 'edit' && this.eventId !== null) {
          const event = this.eventService.getEventById(
            this.eventId
          )() as unknown as Event;

          this.eventType = 'base';

          if (Object.keys(event).includes('numberOfParticipants')) {
            this.eventType = 'sport';
          }

          if (Object.keys(event).includes('genre')) {
            this.eventType = 'music';
          }

          this.eventData = event;

          this.eventForm.patchValue(event);
        }
      });
  }

  saveChanges() {
    let isEventFormValid = false;

    const { name, description, location, numberOfParticipants, genre } = this
      .eventForm.value as Event;

    const value: Omit<Event, 'id'> & Partial<Pick<Event, 'id'>> = {
      name,
      description,
      location,
    };

    isEventFormValid =
      this.getFormControl('name').valid &&
      this.getFormControl('description').valid &&
      this.getFormControl('location').valid;

    switch (this.eventType) {
      case 'sport':
        isEventFormValid =
          isEventFormValid && this.getFormControl('numberOfParticipants').valid;

        value.numberOfParticipants = numberOfParticipants;
        break;

      case 'music':
        isEventFormValid =
          isEventFormValid && this.getFormControl('genre').valid;

        value.genre = genre;
        break;
    }

    if (this.eventId !== null) {
      value.id = this.eventId;
    }

    if (!isEventFormValid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Все поля должны быть заполнены!',
        life: 3000,
      });

      return;
    }

    switch (this.mode) {
      case 'add':
        this.eventService.addEvent(value as Omit<Event, 'id'>);
        break;

      case 'edit':
        this.eventService.editEvent(value as Event);
        break;

      default:
        break;
    }

    this.backToEventList();
  }

  showOrHideEventForm() {
    this.isShowForm = !this.isShowForm;

    this.eventData = this.eventForm.value as Event;
  }

  backToEventList() {
    this.router.navigate(
      [`${this.eventId !== null ? '../' : ''}../event-list`],
      {
        relativeTo: this.activatedRoute,
      }
    );
  }

  private getFormControl(field: keyof Event) {
    return this.eventForm.get(field) as FormControl;
  }
}
