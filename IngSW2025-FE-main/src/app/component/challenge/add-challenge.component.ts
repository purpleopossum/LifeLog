import { Component } from '@angular/core';
import { Challenge, Milestone } from '../../dto/challenge.model';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-challenge',
  templateUrl: './add-challenge.component.html',
  styleUrls: ['./add-challenge.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class DialogAddChallenge {
  title: string = '';
  description: string = '';
  
  newMilestoneDescription: string = '';
  milestonesFormList: string[] = [];


  constructor(private dialogref: MatDialogRef<DialogAddChallenge>) {}

  get currentUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }

  addMilestoneToForm(): void {
    if (this.newMilestoneDescription.trim()) {
      this.milestonesFormList.push(this.newMilestoneDescription.trim());
      this.newMilestoneDescription = '';
    }
  }

  removeMilestoneFromForm(index: number): void {
    this.milestonesFormList.splice(index, 1);
  }

  submitChallenge(): void {
    if (!this.title.trim() || this.milestonesFormList.length === 0) return;

    const mappedMilestones: Milestone[] = this.milestonesFormList.map((desc, index) => {
      return {
        id: 0, 
        description: desc,
        sequenceOrder: index + 1, 
        isCompleted: false
      };
    });

    const entry: Challenge = {
      id: 0,
      title: this.title,
      description: this.description,
      milestones: mappedMilestones
    };

    this.dialogref.close({
        entry,
        userId:this.currentUser?.id
    });
  }

  resetForm(): void {
    this.title = '';
    this.description = '';
    this.milestonesFormList = [];
  }

  goBack(): void {
    this.dialogref.close();
  }
}
