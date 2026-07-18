import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-add-premade',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './dialog-add-premade.component.html',
  styleUrls: ['./premade-habits.component.scss']
})
export class DialogAddPremadeComponent {
  title: string = '';
  description: string = '';
  partOfDay: string = '';
  category: string = '';

  constructor(
    private dialogRef: MatDialogRef<DialogAddPremadeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { defaultCategory: string }
  ) {
    if (data?.defaultCategory) {
      this.category = data.defaultCategory;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.title.trim() && this.partOfDay && this.category) {
      this.dialogRef.close({
        title: this.title,
        description: this.description,
        partOfDay: this.partOfDay,
        category: this.category
      });
    }
  }
}
