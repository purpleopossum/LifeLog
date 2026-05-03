import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Checkin } from '../../dto/checkin.model';

interface DialogData {
  isEdit: boolean;
  entry?: any;
  checkins: Checkin[];
  linkedCheckins: Checkin[];
}

@Component({
  selector: 'dialog-add-entry',
  standalone: true,
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class DialogAddEntry {

  isEdit: boolean;

  title: string = '';
  content: string = '';

  checkins: Checkin[] = [];
  linkedCheckins: Checkin[] = [];

  selectedCheckins: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<DialogAddEntry>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isEdit = data?.isEdit ?? false;

    this.checkins = data?.checkins ?? [];
    this.linkedCheckins = data?.linkedCheckins ?? [];

    if (data?.entry) {
      this.title = data.entry.title;
      this.content = data.entry.content;
    }
  }

  toggleCheckin(id: string, event: Event) {
      const checked = (event.target as HTMLInputElement).checked
    if (checked) {
      if (!this.selectedCheckins.includes(id)) {
        this.selectedCheckins.push(id);
      }
    } else {
      this.selectedCheckins = this.selectedCheckins.filter(x => x !== id);
    }
  }

  submitEntry() {
    const user = JSON.parse(localStorage.getItem('user')!);

    const payload = {
      userId: user.id,
      title: this.title,
      content: this.content,
      checkinIds: this.selectedCheckins
    };

    console.log('SUBMIT:', payload);

    this.dialogRef.close(payload);
  }

  goBack() {
    this.dialogRef.close();
  }
}
