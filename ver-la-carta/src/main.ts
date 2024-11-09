import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient} from '@angular/common/http';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient()  // Configuración de HttpClient aquí
  ]
}).catch(err => console.error(err));
