import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChallengeService } from '../../service/challenge.service';
import { Challenge, Milestone } from '../../dto/challenge.model';
import { DialogAddChallenge } from './add-challenge.component';
import { CommonModule } from '@angular/common';
import { DialogEditChallenge } from './edit-challenge.component';

@Component({
  selector: 'app-challenge-list',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule]
})
export class ChallengeComponent implements OnInit {
  
  challenges: Challenge[] = [];

  get currentUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }
  constructor(
      private challengeService: ChallengeService,
      private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadChallenges();
  }

  loadChallenges(): void {
    this.challengeService.getChallenges(this.currentUser.id).subscribe({
      next: (data) => this.challenges = data,
      error: (err) => console.error('Error loading challenges', err)
    });
  }

  onToggleMilestone(milestone: Milestone): void {
    const previousState = milestone.isCompleted;

    this.challengeService.toggleMilestone(milestone.id, this.currentUser.id).subscribe({
      next: (updatedMilestone) => {
        milestone.isCompleted = updatedMilestone.isCompleted;
      },
      error: (err) => {
        console.error('Error milestone check', err);
        milestone.isCompleted = previousState;
      }
    });
  }

  onDeleteChallenge(challengeId: number): void {
      if (confirm('Do you really want to delete this challenge?')) {
        this.challengeService.deleteChallenge(challengeId, this.currentUser.id).subscribe({
          next: () => {
            this.challenges = this.challenges.filter(c => c.id !== challengeId);
          },
          error: (err) => console.error("Error deleting challenge", err)
        });
      }
    }

    onAddChallenge() {
        const dialogref = this.dialog.open(DialogAddChallenge);

        dialogref.afterClosed().subscribe(result => {
            if (result && result.entry) {
                this.challengeService.createChallenge(this.currentUser.id, result.entry).subscribe({
                    next: (savedChallenge) => {
                        this.challenges = [...this.challenges, savedChallenge];
                    },
                    error: (err) => console.error("Error saving new challenge", err)
                });
            }
        });
    }

    onEditChallenge(challenge: Challenge): void {
        const dialogref = this.dialog.open(DialogEditChallenge, { data: { challenge: challenge } });

        dialogref.afterClosed().subscribe(result => {
            if (result && result.entry) {
                this.challengeService.updateChallenge(challenge.id, this.currentUser.id, result.entry).subscribe({
                    next: (savedChallenge) => {
                        this.challenges = this.challenges.map(c => c.id === savedChallenge.id ? savedChallenge : c);
                    },
                    error: (err) => console.error("Error updating challenge", err)
                });
            }
        });
    }

    getChallengeProgress(challenge: Challenge): number {
        if (!challenge.milestones || challenge.milestones.length === 0) {
            return 0;
        }
        const completedCount = challenge.milestones.filter(m => m.isCompleted).length;
        return (completedCount / challenge.milestones.length) * 100;
    }

    getCompletedMilestonesCount(challenge: Challenge): number {
        if (!challenge.milestones) return 0;
        return challenge.milestones.filter(m => m.isCompleted).length;
    }
}
