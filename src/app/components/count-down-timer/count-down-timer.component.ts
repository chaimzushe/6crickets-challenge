import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { interval, map, Subject, take, takeUntil } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import {MatCardModule} from '@angular/material/card';

import {
  MatSnackBar,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-count-down-timer',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './count-down-timer.component.html',
  styleUrl: './count-down-timer.component.css'
})
export class CountDownTimerComponent implements OnInit, OnDestroy{
    private snackbar = inject(MatSnackBar);
    private unsubscribe$ = new Subject<void>();
    public secondsLeft: number = 0;
    public readableTime: string = '00:00:00';

    get timerData(){
      return this.secondsLeft > 0 ? `Seconds left to deadline ${this.secondsLeft}` : 'The deadline has passed!'
    }

    constructor(private projectService:ProjectService) {}
  
    ngOnInit(): void {
        this.projectService.getProjectDeadLine()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (response: any) => {
            this.secondsLeft = response.secondsLeft;
            this.startCountdown();
          },
          error: (err: any) => {
            this.snackbar.open(`Error fetching deadline: ${err.message}`, '', {
              duration: 3000,
              panelClass: 'panel-err',
            });
          },
        });
    }
  
    ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  
    startCountdown(): void {
      interval(1000)
        .pipe(
          take(this.secondsLeft), // unsubscribe when timer is done
          takeUntil(this.unsubscribe$),
          map(() => {
            this.secondsLeft--;
            this.readableTime = this.formatTime(this.secondsLeft);
          })
        )
        .subscribe();
    }
  
    private formatTime(seconds: number): string {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
  
      return `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(secs)}`;
    }
  
    private padNumber(num: number): string {
      return num < 10 ? `0${num}` : `${num}`;
    }
  
  
}
