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
import { UserService } from '../../service/user.service';
import { EncouragementMessageText, EncouragementMessageType } from '../../dto/user.model';
import { Friendship } from '../../dto/friend.model';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, AfterViewInit, OnDestroy {

  stats!: Stats;
  friendship?: Friendship | null;
  friendStats?: Stats | null;
  partnerCode: string = '';
  pendingFriends: Friendship[] = [];
  lineChartInstance?: Chart;
  donutChartInstance?: Chart;
  partnerDonutChartInstance?: Chart;
  partnerLineChartInstance?: Chart;
  requestMessage: string = '';
  messageOptions = Object.values(EncouragementMessageType);
  selectedMessage?: EncouragementMessageType;
  textMap = EncouragementMessageText;

  @ViewChild('donutChart') donutChart!: ElementRef;
  @ViewChild('lineChart') lineChart!: ElementRef;
  @ViewChild('partnerDonutChart') partnerDonutChart!: ElementRef;
  @ViewChild('partnerLineChart') partnerLineChart!: ElementRef;

  constructor(
      private statsService: StatsService,
      private friendService: FriendService,
      private userService: UserService, 
      private cd: ChangeDetectorRef
  ) {}

  get currentUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }
  get friend() {
    if (!this.friendship) {
        return null;
    }

    return this.friendship.sender.id === this.currentUser.id
        ? this.friendship.receiver
        : this.friendship.sender;
  }

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
      this.friendService.getFriend(this.currentUser.id).subscribe(data => {
          this.friendship = data ?? null;

          if (this.friendship && this.friend && this.friend.id) {
              this.loadStats(this.friend.id, 'friend');
          } else {
              this.friendService.getPending(this.currentUser.id).subscribe(data => {
                  this.pendingFriends = data;
              });
          }
      });
  }

  

  get currentMessage(): string | undefined {
    const msg = this.currentUser?.message as EncouragementMessageType | undefined;

    return msg ? this.textMap[msg] : undefined;
  }
 
  get currentFriendMessage(): string | undefined {
    const msg = this.friend?.message as EncouragementMessageType | undefined;

    return msg ? this.textMap[msg] : undefined;
  }

  ngOnInit(): void {
      this.loadStats(this.currentUser.id, 'self');
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
                  label: 'Completion %',
                  data: this.stats.completedLastSevenDays ?? [],
                  borderColor: '#0094fd',
                  tension: 0.3
              }]
          },
          options: {
              responsive: true,
              scales: {
                  y: {
                      min: 0,
                      max: 100,
                      ticks: {
                          stepSize: 25,                          
                          callback: function(value) {
                              return value + '%';
                          }
                      }
                  }
              }
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
                      label: 'Completion %',
                      data: this.friendStats.completedLastSevenDays ?? [],
                      borderColor: '#0094fd',
                      tension: 0.3
                  }]
              },
              options: {
                  responsive: true,
                  scales: {
                      y: {
                          min: 0,
                          max: 100,
                          ticks: {
                              stepSize: 25,                          
                              callback: function(value) {
                                  return value + '%';
                              }
                          }
                      }
                  }
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
    this.friendService.request(this.currentUser.id, partnerCode).subscribe({
        next: (res) => {
            this.requestMessage = res.message;
        },
        error: (err) => {
            this.requestMessage = err.error;
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

  setMessage(message: EncouragementMessageType) {
    this.userService.setMessage(this.currentUser.id, message)
        .subscribe(user => {
            localStorage.setItem('user', JSON.stringify(user));
        })
  }
  clearMessage() {
    this.userService.clearMessage(this.currentUser.id)
        .subscribe(user => {
            localStorage.setItem('user', JSON.stringify(user));
        });
   }

   removeFriend() {
    if (!this.friendship) {
        return;
    }
    this.friendService.removeFriendship(this.friendship.id)
        .subscribe(() => {
            this.friendship = null;
            this.friendStats = null;
            this.loadFriends();
        });
   }
    
   copyFriendCode() {
    const code = this.currentUser?.friendCode;

    if (!code) return;

    navigator.clipboard.writeText(code)
        .then(() => {
            console.log('Copied:', code);
        })
        .catch(err => {
            console.error('Copy failed', err)
        });
   }

   regenerateFriendCode() {
    if (this.currentUser) {
        this.userService.regenerateFriendCode(this.currentUser.id).subscribe({
            next: (updatedUser) => {
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert("New friend code succesfully generated!");
            },
            error: (err) => {
                console.error("Error during friend code regeneration", err);
                alert("An error has occurred, retry.");
            }
        })
    }
   }
}
