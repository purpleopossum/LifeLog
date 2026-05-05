import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Entry } from '../../dto/journal.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddEntry } from './add-entry.component';
import { EntryService } from '../../service/entry.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {
    constructor(
        private dialog: MatDialog,
        private entryService: EntryService
    ) {}
    loadJournal() {
        const user = JSON.parse(localStorage.getItem('user')!);

        this.entryService.getByUser(user.id)
        .subscribe(data => {
            this.journal = data;
        });
    }
    ngOnInit(): void {
        this.loadJournal();
    }

    journal: Entry[] = [];

    expandedContent: Set<string> = new Set();
    expandedCheckins: Set<string> = new Set();

    toggleContent(i: string) {
        this.expandedContent.has(i)
            ? this.expandedContent.delete(i)
            : this.expandedContent.add(i);
    }

    toggleCheckins(i: string) {
        this.expandedCheckins.has(i)
            ? this.expandedCheckins.delete(i)
            : this.expandedCheckins.add(i);
    }

    deleteEntry(id: string) {
        if (confirm('Delete this journal entry?')) {
            this.entryService.delete(id).subscribe(() => {
                this.loadJournal();
            })
        }
    }

    editEntry(entry: Entry) {
        const dialogRef = this.dialog.open(DialogAddEntry, {
            data: {
                isEdit: true,
                entry: entry,
                checkins: [],
                linkedCheckins: entry.linkedCheckins || []
            }
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result) {
                await lastValueFrom(
                    this.entryService.update(entry.id!, {
                        title: result.title,
                        content: result.content
                    })
                );

                this.loadJournal();
            }
        });
    }

    addEntry() {
        const dialogRef = this.dialog.open(DialogAddEntry, {
            data: {
                isEdit: false,
                checkins: [],
                linkedCheckins: []
            }
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result) {
                await lastValueFrom(
                    this.entryService.create({
                        title: result.title,
                        content: result.content
                    }, result.userId)
                );

                this.loadJournal();
            }
        });
    }

    getMonthYear(date: string): string {
        return new Date(date).toLocaleDateString('en-GB', {
          month: 'long',
          year: 'numeric'
      });
  }

  getFormattedDate(date: string): string {
      return new Date(date).toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'short'
      });
  }

  shouldShowHeader(i: number): boolean {
      if (i === 0) return true;

      const currEntry = this.journal[i];
      const prevEntry = this.journal[i - 1];

      if (!currEntry || !prevEntry) return false;

      const curr = new Date(currEntry.entryDate);
      const prev = new Date(prevEntry.entryDate);

      return (
          curr.getMonth() !== prev.getMonth() ||
              curr.getFullYear() !== prev.getFullYear()
      );
  }

}
