import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
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
export class StatsComponent implements OnInit, AfterViewInit {

  stats!: Stats;
  partnerCode: string = '';

  @ViewChild('donutChart') donutChart!: ElementRef;
  @ViewChild('lineChart') lineChart!: ElementRef;
  @ViewChild('partnerDonutChart') partnerDonutChart!: ElementRef;
  @ViewChild('partnerLineChart') partnerLineChart!: ElementRef;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);

    this.statsService.getStats(user.id).subscribe(data => {
      this.stats = data;
      setTimeout(() => this.buildCharts());
    });
  }

  ngAfterViewInit(): void {}

  buildCharts() {
    if (!this.stats) return;

    new Chart(this.donutChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Skipped', 'To-do'],
        datasets: [{
          data: [
            this.stats.totalWeekCompleted,
            this.stats.totalWeekSkipped,
            this.stats.totalHabits * 7 -
            (this.stats.totalWeekCompleted + this.stats.totalWeekSkipped)
          ]
        }]
      }
    });

    new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: this.getLast7Days(),
        datasets: [{
          data: this.stats.completedLastSevenDays
        }]
      }
    });

    if (this.stats.partner) {
      new Chart(this.partnerDonutChart.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Skipped', 'To-do'],
          datasets: [{
            data: [
              this.stats.partner.totalWeekCompleted,
              this.stats.partner.totalWeekSkipped,
              this.stats.partner.totalHabits * 7 -
              (this.stats.partner.totalWeekCompleted + this.stats.partner.totalWeekSkipped)
            ]
          }]
        }
      });

      new Chart(this.partnerLineChart.nativeElement, {
        type: 'line',
        data: {
          labels: this.getLast7Days(),
          datasets: [{
            data: this.stats.partner.completedLastSevenDays
          }]
        }
      });
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
      location.reload();
    });
  }
}
