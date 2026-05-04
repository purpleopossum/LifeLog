import {Component, inject, Inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Habit} from '../../dto/habit.model';
import {HabitService} from '../../service/habit.service';
import {lastValueFrom} from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { Checkin } from '../../dto/checkin.model';
import { CheckinService } from '../../service/checkin.service';
import { DayCarouselComponent } from '../day-carousel/day-carousel.component';

@Component({
  selector: 'app-habits',
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    CommonModule,
    DayCarouselComponent
  ],
  templateUrl: './habits.component.html',
  styleUrl: './habits.component.scss'
})
export class HabitsComponent implements OnInit {
  selectedDate: string = new Date().toISOString().split('T')[0] ?? '';
  habits: Habit[] = [];
  checkins: Checkin[] = [];
  editingCheckinId: string | null = null;
  today = new Date();
  selectedFilter: string = 'All';
  filteredHabits: Habit[] = [];
  filteredHabitsAny: Habit[] = [];
  selectedStatus: string = 'All';
  readonly dialog = inject(MatDialog);



  constructor(private habitService: HabitService, private checkinService: CheckinService) {}


  async ngOnInit() {
    await this.loadData();
  }

  onFilterChanged(filter: string) {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  onStatusChanged(status: string) {
    this.selectedStatus = status;
    this.applyFilters();
  }

  async loadData() {
    const user = JSON.parse(localStorage.getItem('user')!);

    this.habits = await lastValueFrom(this.habitService.getByUserId(user.id));
    this.checkins = await lastValueFrom(this.checkinService.getByUser(user.id));

    this.applyFilters();
  }

  applyFilters() {
    this.filteredHabits = this.habits.filter(habit => {
      const matchesPartOfDay = 
          this.selectedFilter === 'All' || habit.partOfDay === this.selectedFilter;
      
      const checkin = this.getCheckinForHabitAndDate(habit.id!, this.selectedDate);
      const matchesStatus = 
        this.selectedStatus === 'All' ||
        (checkin && checkin.status === this.selectedStatus); // Assumendo status 'COMPLETED' o 'SKIPPED'

      return matchesPartOfDay && matchesStatus;
    });
  }


  async onDateChanged(newDate: string) {
    this.selectedDate = newDate;
    this.applyFilters();
  }

  getCheckinForHabitAndDate(habitId: string, date: string) {
    return this.checkins.find(c => c.habit.id === habitId && c.date === date);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddHabit, {});

    dialogRef.afterClosed().subscribe(_result => {
      console.log('The dialog was closed');
      this.loadData().then(() => {
        console.log('Habits reloaded');
      });
    });
  }
  openEditDialog(habit: Habit): void {
    const dialogRef = this.dialog.open(DialogEditHabit, {
      data: habit
    });

    dialogRef.afterClosed().subscribe(_result => {
      this.loadData().then(() => {
        console.log('Habits reloaded');
      });
    });
  }

  async updateCheckin(habit: Habit, status: string) {
    let checkin = this.getCheckinForHabitAndDate(habit.id!, this.selectedDate);

    if (!checkin) {
      // Se non esiste, crea il checkin
      checkin = {
        habit: habit,
        date: this.selectedDate,
        status: status,
        note: '',
      } as Checkin;
      await lastValueFrom(this.checkinService.create(checkin));
    } else {
      // Se esiste, aggiorna lo stato
      checkin.status = status;
      await lastValueFrom(this.checkinService.update(checkin.id!, checkin));
    }
    await this.loadData();
  }
  
  async saveCheckinEdit(checkin: Checkin) {
    await lastValueFrom(this.checkinService.update(checkin.id!, checkin));
    this.editingCheckinId = null;
    await this.loadData();
  }
  async deleteItem(id: string): Promise<void> {
    await lastValueFrom(this.checkinService.delete(id));
    await this.loadData();
  }
}

@Component(
  {
    selector: 'dialog-add-habit',
    templateUrl: './dialog-add-habit.html',
    styleUrl: './habits.component.scss',
    imports: [
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      MatButtonModule
    ]
  }
)
export class DialogAddHabit{
  readonly dialogRef = inject(MatDialogRef<DialogAddHabit>);
  title: string='';
  description: string='';
  partOfDay: string='Any';

  onNoClick(): void {
    this.dialogRef.close();
  }

  constructor(private HabitService: HabitService) {}

  async save() {
    let habit = new Habit();
    const user = JSON.parse(localStorage.getItem('user')!);
    habit.userId = user.id;
    habit.title = this.title;
    habit.description = this.description;
    habit.partOfDay = this.partOfDay;
    await lastValueFrom(this.HabitService.create(habit));
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-edit-habit',
  templateUrl: './dialog-edit-habit.html',
  styleUrl: './habits.component.scss',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class DialogEditHabit {
  title: string;
  description: string;
  partOfDay: string;

  constructor(
    private habitService: HabitService,
    private dialogRef: MatDialogRef<DialogEditHabit>,
    @Inject(MAT_DIALOG_DATA) public data: Habit
  ) {
    this.title = data.title;
    this.description = data.description;
    this.partOfDay = data.partOfDay;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async save(): Promise<void> {
    const updatedHabit = {
      ...this.data,
      title: this.title,
      description: this.description,
      partOfDay: this.partOfDay
    };
    await lastValueFrom(this.habitService.update(this.data.id!, updatedHabit));
    this.dialogRef.close();
  }
}
