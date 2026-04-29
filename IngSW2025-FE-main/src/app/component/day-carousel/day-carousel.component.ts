import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-day-carousel',
  templateUrl: './day-carousel.component.html',
  styleUrls: ['./day-carousel.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class DayCarouselComponent {
  @Input() currentDate = new Date();
  @Output() dateChanged = new EventEmitter<string>();

  selectedDate = new Date();

  ngOnInit() {
    this.selectedDate = new Date(this.currentDate);
  }

  getDayLabel(date: Date): string {
    const diff = this.getDateDiffInDays(date, this.currentDate);
    if (diff === 0) return 'Oggi';
    if (diff === -1) return 'Ieri';
    if (diff === 1) return 'Domani';
    return this.formatFullDate(date);
  }

  getDaysToShow(): Date[] {
    const days: Date[] = [];
    for (let i = -7; i <= 7; i++) {
      const d = new Date(this.selectedDate);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }

  isToday(date: Date): boolean {
    return this.getDateDiffInDays(date, this.currentDate) === 0;
  }

  isSelected(date: Date): boolean {
    return this.getDateDiffInDays(date, this.selectedDate) === 0;
  }

  moveSelection(delta: number) {
    const newDate = new Date(this.selectedDate);
    newDate.setDate(newDate.getDate() + delta);

    const diff = this.getDateDiffInDays(newDate, this.currentDate);
    if (diff < -14 || diff > 14) {
      return;
    }

    this.selectedDate = newDate;
    this.dateChanged.emit(this.selectedDate.toISOString().split('T')[0]);
  }

  private getDateDiffInDays(a: Date, b: Date): number {
    const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
    const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((da.getTime() - db.getTime()) / (1000 * 60 * 60 * 24));
  }

  private formatFullDate(date: Date): string {
    return new Intl.DateTimeFormat('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
}
