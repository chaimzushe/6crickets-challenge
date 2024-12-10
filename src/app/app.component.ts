import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountDownTimerComponent } from './components/count-down-timer/count-down-timer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CountDownTimerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '6crickets-challenge';
}
