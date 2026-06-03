import {
    Component,
    OnInit,
    AfterViewInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatsService } from '../../service/stats.service';
import { FriendService } from '../../service/friend.service';
import { Stats } from '../../dto/stats.model';
import { Chart } from 'chart.js/auto';
import { Friend } from '../../dto/friend.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, AfterViewInit, OnDestroy {

  stats!: Stats;
  friend?: Friend | null; 
  friendStats?: Stats | null;
  partnerCode: string = '';
  pendingFriends: Friend[] = [];
  lineChartInstance?: Chart;
  donutChartInstance?: Chart;
  partnerDonutChartInstance?: Chart;
  partnerLineChartInstance?: Chart;

  @ViewChild('donutChart') donutChart!: ElementRef;
  @ViewChild('lineChart') lineChart!: ElementRef;
  @ViewChild('partnerDonutChart') partnerDonutChart!: ElementRef;
  @ViewChild('partnerLineChart') partnerLineChart!: ElementRef;

  constructor(
      private statsService: StatsService,
      private friendService: FriendService,
      private cd: ChangeDetectorRef
  ) {}

  loadStats(userId: string, target: 'self' | 'friend') {
      this.statsService.getStats(userId).subscribe(data => {
          if (target === 'self') {
            this.stats = data;
          } else {
            this.friendStats = data;
          }
          this.cd.detectChanges();
          setTimeout(() => this.buildCharts());
      });
  }

  loadFriends() {
      const user = JSON.parse(localStorage.getItem('user')!);

      this.friendService.getFriend(user.id).subscribe(data => {
          this.friend = data ?? null;

          if (this.friend) {
              this.loadStats(this.friend.userId, 'friend');
          } else {
              this.friendService.getPending(user.id).subscribe(data => {
                  this.pendingFriends = data;
              });
          }
      });
  }

  ngOnInit(): void {
      const user = JSON.parse(localStorage.getItem('user')!);
      this.loadStats(user.id, 'self');
      this.loadFriends();
  }

  ngAfterViewInit() {}

  buildCharts() {
      if (!this.stats || !this.donutChart || !this.lineChart) {
          console.log("DOM not ready yet");
          return;
      }

      this.donutChartInstance?.destroy();
      this.partnerDonutChartInstance?.destroy();
      this.lineChartInstance?.destroy();
      this.partnerLineChartInstance?.destroy();

      const canvas = this.donutChart.nativeElement;
      const ctx = canvas.getContext('2d');

      this.donutChartInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
              labels: ['Completed', 'Skipped', 'To-do'],
              datasets: [{
                  data: [
                      this.stats.totalWeekCompleted ?? 0,
                      this.stats.totalWeekSkipped ?? 0,
                      Math.max(0,
                        (this.stats.totalWeekCheckins ?? 0)
                        - ((this.stats.totalWeekCompleted ?? 0) + (this.stats.totalWeekSkipped ?? 0))
                        )
                  ]
              }]
          }
      });
      this.lineChartInstance = new Chart(this.lineChart.nativeElement, {
          type: 'line',
          data: {
              labels: this.getLast7Days(),
              datasets: [{
                  label: 'Completed',
                  data: this.stats.completedLastSevenDays ?? [],
                  borderColor: '#0094fd',
                  tension: 0.3
              }]
          }
      });

      

      if (this.friend && this.friendStats && this.partnerDonutChart && this.partnerLineChart) {
          this.partnerDonutChartInstance = new Chart(this.partnerDonutChart.nativeElement, {
              type: 'doughnut',
              data: {
                  labels: ['Completed', 'Skipped', 'To-do'],
                  datasets: [{
                      data: [
                          this.friendStats.totalWeekCompleted,
                          this.friendStats.totalWeekSkipped,
                          Math.max(0,
                          (this.friendStats.totalWeekCheckins ?? 0)
                          - ((this.friendStats.totalWeekCompleted ?? 0) + (this.friendStats.totalWeekSkipped ?? 0))
                            )

                      ]
                  }]
              }
          });
          this.partnerLineChartInstance = new Chart(this.partnerLineChart.nativeElement, {
              type: 'line',
              data: {
                  labels: this.getLast7Days(),
                  datasets: [{
                      label: 'Completed',
                      data: this.friendStats.completedLastSevenDays ?? [],
                      borderColor: '#0094fd',
                      tension: 0.3
                  }]
              }
          });

      }
  }

  ngOnDestroy(): void {
      try {
          this.donutChartInstance?.destroy();
      } catch (e) {
          console.warn('Error destroying donutChartInstance', e);
      }
      try {
          this.lineChartInstance?.destroy();
      } catch (e) {
          console.warn('Error destroying lineChartInstance', e);
      }
      try {
          this.partnerDonutChartInstance?.destroy();
      } catch (e) {
          console.warn('Error destroying partnerDonutChartInstance', e);
      }
      try {
          this.partnerLineChartInstance?.destroy();
      } catch (e) {
          console.warn('Error destroying partnerLineChartInstance', e);
      }
  }

  getLast7Days(): string[] {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toLocaleDateString('en-GB', { weekday: 'short' }));
    }
    return days;
  }

  request(partnerCode: string) {
      const user = JSON.parse(localStorage.getItem('user')!);
    this.friendService.request(user.id, partnerCode).subscribe({
        next: (res) => {
            console.log('RESPONSE:', res);
        },
        error: (err) => {
            console.error('ERROR:', err);
        }
    });
  }

  accept(friendshipId: string) {
    this.friendService.accept(friendshipId).subscribe(() => {
        this.loadFriends();
    })
  }

  reject(friendshipId: string) {
    this.friendService.reject(friendshipId).subscribe(() => {
        this.loadFriends();
    })
  }
}
