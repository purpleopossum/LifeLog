import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PremadeHabit } from '../../dto/habit.model';
import { HabitService } from '../../service/habit.service';
import { DialogAddPremadeComponent } from './dialog-add-premade.component';
import { DialogEditPremadeComponent } from './dialog-edit-premade.component';

@Component({
  selector: 'app-premade-habits',
  templateUrl: './premade-habits.component.html',
  styleUrls: ['./premade-habits.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule
  ]
})
export class PremadeHabitsComponent implements OnInit {
  premadeHabits: PremadeHabit[] = [];
  categories: string[] = ['Health', 'Productivity', 'Mind Training'];
  selectedCategory: string = 'Health';
  isAdmin: boolean = false;

  constructor(
    private service: HabitService, 
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkAdmin();
    this.loadPremadeHabits();
  }

  get currentUser() {
    try {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      return null;
    }
  }

  loadPremadeHabits(): void {
    this.service.getPremade().subscribe({
      next: (data: PremadeHabit[]) => {
        this.premadeHabits = data;
      },
      error: (err) => {
        console.error("Error during API call:", err);
      }
    });
  }

  checkAdmin(): void {
    const user = this.currentUser;
    this.isAdmin = !!(user && user.admin === true);
  }

  get filteredPremadeHabits(): PremadeHabit[] {
    return this.premadeHabits.filter(h => h.category === this.selectedCategory);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  openPremadeDialog(habit: PremadeHabit): void {
    const dialogRef = this.dialog.open(DialogEditPremadeComponent, {
      width: '400px',
      data: { habit: habit }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'saved' || result?.action === 'deleted') {
        this.loadPremadeHabits(); 
      }
    });
  }

  openAddPremadeDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPremadeComponent, {
      width: '400px',
      data: { defaultCategory: this.selectedCategory }
    });

    dialogRef.afterClosed().subscribe((result: PremadeHabit | undefined) => {
      if (result) {
        this.createPremadeHabit(result);
      }
    });
  }

  addPremadeHabit(habit: PremadeHabit): void {
    if (!this.currentUser?.id) {
      alert('User not found!');
      return;
    }

    const newHabitPayload = {
      title: habit.title,
      description: habit.description,
      partOfDay: habit.partOfDay,
      userId: this.currentUser.id
    };

    this.service.create(newHabitPayload).subscribe({
      next: () => {
        this.router.navigate(['/habits']);
      },
      error: (err) => {
        console.error("Error adding premade habit:", err);
        alert("Error adding premade habit. Retry.");
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/habits']);
  }

  createPremadeHabit(premadeHabit: PremadeHabit) {
     this.service.createPremade(premadeHabit).subscribe({
         next: () => {
             this.loadPremadeHabits();
         },
         error: (err) => {
            console.error('Error creating Habit:', err);
            alert('Error creating Habit.');
         }
     });
  }

  deletePremadeHabit(PHabitId: string) {
    this.service.deletePremade(PHabitId).subscribe({
        next: () => {
            this.loadPremadeHabits();
        },
        error: (err) => {
            console.error('Error deleting Habit:', err);
            alert('Error deleting Habit.');
        }
    });
  }
}
