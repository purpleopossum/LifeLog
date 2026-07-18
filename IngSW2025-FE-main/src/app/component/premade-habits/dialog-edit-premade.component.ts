import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { PremadeHabit } from '../../dto/habit.model';
import { HabitService } from '../../service/habit.service';

@Component({
  selector: 'app-dialog-edit-premade',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './dialog-edit-premade.component.html',
  styleUrls: ['./dialog-edit-premade.component.scss']
})
export class DialogEditPremadeComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<DialogEditPremadeComponent>);
  private service = inject(HabitService);
  
  public data = inject<{ habit: PremadeHabit }>(MAT_DIALOG_DATA);

  habitData!: PremadeHabit;
  categories: string[] = ['Health', 'Productivity', 'Mind Training'];
  partsOfDay: string[] = ['morning', 'afternoon', 'evening'];

  constructor() {}

  ngOnInit(): void {
    this.habitData = { ...this.data.habit };
  }

  save(): void {
    if (!this.habitData.title.trim()) {
      alert('Title is required!');
      return;
    }

    this.service.updatePremade(this.habitData.id, this.habitData).subscribe({
      next: () => {
        this.dialogRef.close({ action: 'saved' });
      },
      error: (err) => {
        console.error('Error updating premade habit:', err);
        alert('Error updating habit.');
      }
    });
  }

  delete(): void {
    if (confirm(`Are you sure you want to delete "${this.habitData.title}" from the catalog?`)) {
      this.service.deletePremade(this.habitData.id).subscribe({
        next: () => {
          this.dialogRef.close({ action: 'deleted' });
        },
        error: (err) => {
          console.error('Error deleting premade habit:', err);
          alert('Error deleting habit.');
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
