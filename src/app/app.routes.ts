import { Routes } from '@angular/router';
import { InstructorsComponent } from './instructors/instructors.component';
import { EventsComponent } from './events/events.component';

export const routes: Routes = [
    {
        path: "",
        component: InstructorsComponent
    },
    {
        path: "events/:id",
        component: EventsComponent
    }
];
