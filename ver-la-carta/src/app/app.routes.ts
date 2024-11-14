import { Routes, provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { bootstrapApplication } from '@angular/platform-browser';

export const routes: Routes = [
    {path: '', component: AppComponent,}
];

bootstrapApplication(AppComponent, {
    providers: [provideRouter(routes)],
});
