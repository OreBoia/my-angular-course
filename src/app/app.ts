import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MyComponent } from './my-component/my-component';
import { HelloWorldComponent } from './hello-world-component/hello-world-component';
import { BindingComponent } from './binding-component/binding-component';
import { DirettiveComponent } from './direttive-component/direttive-component';
import { PadreComponent } from './padre-component/padre-component';
import { HomeComponent } from './home-component/home-component';
import { AboutComponent } from './about-component/about-component';
import { RegistrazioneComponent } from './registrazione-component/registrazione-component';
import { LoginComponent } from './login-component/login-component';
import { CounterComponent } from './counter/counter.component';
import { SignalsDemoComponent } from './signals-demo/signals-demo.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
            RouterModule,
            MyComponent,
            HelloWorldComponent,
            BindingComponent,
            DirettiveComponent,
            PadreComponent,
            HomeComponent,
            AboutComponent,
            RegistrazioneComponent,
            LoginComponent,
            CounterComponent,
            SignalsDemoComponent,
            UserProfileComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'my-angular-course';
}
