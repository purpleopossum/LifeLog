import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Challenge, Milestone } from '../../dto/challenge.model';

@Component({
  selector: 'dialog-edit-challenge',
  standalone: true,
  templateUrl: './edit-challenge.component.html',
  styleUrl: './edit-challenge.component.scss',
  imports: [FormsModule, CommonModule]
})
export class DialogEditChallenge implements OnInit {
  title: string = '';
  description: string = '';
  
  newMilestoneDescription: string = '';
  milestonesFormList: string[] = [];
  
  private completedMilestonesOrders = new Set<number>();

  constructor(
    private dialogRef: MatDialogRef<DialogEditChallenge>,
    @Inject(MAT_DIALOG_DATA) public data: { challenge: Challenge }
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.challenge) {
      this.title = this.data.challenge.title;
      this.description = this.data.challenge.description;
      
      this.data.challenge.milestones.forEach(m => {
        this.milestonesFormList.push(m.description);
        if (m.isCompleted) {
          this.completedMilestonesOrders.add(m.sequenceOrder);
        }
      });
    }
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
    if (!this.title.trim()) return;

    const mappedMilestones: Milestone[] = this.milestonesFormList.map((desc, index) => {
      const currentOrder = index + 1;
      return {
        id: 0, 
        description: desc,
        sequenceOrder: currentOrder, 
        isCompleted: this.completedMilestonesOrders.has(currentOrder)
      };
    });

    const updatedEntry: Challenge = {
      id: this.data.challenge.id,
      title: this.title,
      description: this.description,
      milestones: mappedMilestones
    };

    this.dialogRef.close({ entry: updatedEntry });
  }

  goBack(): void {
    this.dialogRef.close();
  }
}
