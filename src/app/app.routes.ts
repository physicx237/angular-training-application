import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/event-list',
    pathMatch: 'full',
  },
  {
    path: 'event-list',
    loadComponent: () =>
      import('./components/event-list/event-list.component').then(
        (module) => module.EventListComponent
      ),
  },
  {
    path: 'event-editor',
    loadComponent: () =>
      import('./components/event-editor/event-editor.component').then(
        (module) => module.EventEditorComponent
      ),
  },
  {
    path: 'event-editor/:id',
    loadComponent: () =>
      import('./components/event-editor/event-editor.component').then(
        (module) => module.EventEditorComponent
      ),
  },
];
