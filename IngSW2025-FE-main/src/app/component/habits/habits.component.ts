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
import { HabitUpdateDTO } from '../../dto/habit.model';

interface HabitViewModel extends Habit {
    currentCheckin?: Checkin | undefined;
}

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
  selectedDate: string = this.formatDate(new Date());
  habits: Habit[] = [];
  checkins: Checkin[] = [];
  editingCheckinId: string | null = null;
  editingCheckinClone: Checkin | null = null;
  today = new Date();
  selectedFilter: string = 'All';
  filteredHabits: HabitViewModel[] = [];
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
      const habitsMapped: HabitViewModel[] = this.habits.map(habit => {
          const checkin = this.checkins.find(c => c.habit.id === habit.id && c.date === this.selectedDate);
          return {
              ...habit,
              currentCheckin: checkin
          };
      });

      this.filteredHabits = habitsMapped.filter(habit => {
          const matchesPartOfDay = 
              this.selectedFilter === 'All' || habit.partOfDay === this.selectedFilter;

          const matchesStatus = 
              this.selectedStatus === 'All' ||
              (habit.currentCheckin && habit.currentCheckin.status === this.selectedStatus);

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

  trackByHabitId(_index: number, habit: HabitViewModel): string {
      return habit.id!;
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
    try {
      let checkin = this.getCheckinForHabitAndDate(habit.id!, this.selectedDate);

      if (!checkin) {
        checkin = {
          status: status,
          note: '',
          mood: 0,
          date: this.selectedDate,
          habit: habit,
        } as Checkin;
        await lastValueFrom(this.checkinService.create(habit.id!, checkin));
      } else {
        checkin.status = status;
        await lastValueFrom(this.checkinService.update(checkin.id!, {
          status: status,
          note: checkin.note ?? '',
          mood: checkin.mood ?? 0
        }));
      }
      await this.loadData();
    } catch (error) {
      console.error('Error updating checkin:', error);
      alert('Error updating checkin');
    }
  }
  
  startEditing(checkin: Checkin) {
    this.editingCheckinId = checkin.id!;
    this.editingCheckinClone = JSON.parse(JSON.stringify(checkin));
  }
  async saveCheckinEdit() {
  if (!this.editingCheckinClone) return;

  try {
    await lastValueFrom(this.checkinService.update(this.editingCheckinClone.id!, { 
        status: this.editingCheckinClone.status,
        note: this.editingCheckinClone.note ?? '',
        mood: this.editingCheckinClone.mood ?? 0,
    }));

    const index = this.checkins.findIndex(c => c.id === this.editingCheckinClone!.id);
    if (index !== -1) {
        if (!this.checkins[index]) return;
        const originalCheckin = this.checkins[index];

      this.checkins[index] = { 
        ...originalCheckin, 
        note: this.editingCheckinClone.note ?? '',
        mood: this.editingCheckinClone.mood ?? 0,
        status: this.editingCheckinClone.status,
      };
    }

    this.editingCheckinId = null;
    this.editingCheckinClone = null;
    
    this.applyFilters(); 
  } catch (error){
    console.error('Errore saving note:', error);
    alert('Error saving note');
  }
}
    async deleteItem(id: string): Promise<void> {
    this.editingCheckinId = null;
    await lastValueFrom(this.checkinService.delete(id));
    await this.loadData();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    const user = JSON.parse(localStorage.getItem('user')!);
    const habit: HabitUpdateDTO = {
        title: this.title,
        description: this.description,
        partOfDay: this.partOfDay,
        userId: user.id
    };
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
