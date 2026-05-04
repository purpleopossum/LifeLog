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
import { Stats } from '../../dto/stats.model';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, AfterViewInit, OnDestroy {

  stats!: Stats;
  partnerCode: string = '';
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
      private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
      const user = JSON.parse(localStorage.getItem('user')!);

      this.statsService.getStats(user.id).subscribe(data => {
          this.stats = data;
          this.cd.detectChanges();
          setTimeout(() => {
              this.buildCharts();
          })
      });
  }

  ngAfterViewInit() {}

  buildCharts() {
      if (!this.stats || !this.donutChart || !this.lineChart) {
          console.log("DOM not ready yet");
          return;
      }

      this.donutChartInstance?.destroy();
      this.partnerDonutChartInstance?.destroy();

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

      

      if (this.stats.partner && this.partnerDonutChart && this.partnerLineChart) {
          this.partnerDonutChartInstance = new Chart(this.partnerDonutChart.nativeElement, {
              type: 'doughnut',
              data: {
                  labels: ['Completed', 'Skipped', 'To-do'],
                  datasets: [{
                      data: [
                          this.stats.partner.totalWeekCompleted,
                          this.stats.partner.totalWeekSkipped,
                          Math.max(0,
                          (this.stats.partner.totalWeekCheckins ?? 0)
                          - ((this.stats.partner.totalWeekCompleted ?? 0) + (this.stats.partner.totalWeekSkipped ?? 0))
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
                      data: this.stats.partner.completedLastSevenDays ?? [],
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

  unfriend() {
    if (confirm('Remove partner?')) {
      this.statsService.unfriend().subscribe(() => {
        this.stats.partner = undefined;
      });
    }
  }

  addPartner() {
      this.statsService.addPartner(this.partnerCode).subscribe(() => {
          const user = JSON.parse(localStorage.getItem('user')!);
          this.statsService.getStats(user.id).subscribe(data => {
              this.stats = data;
              this.cd.detectChanges();
              this.buildCharts();
          });
      });
  }
}
