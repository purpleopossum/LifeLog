import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CheckinService } from '../../service/checkin.service';
import { Checkin } from '../../dto/checkin.model';

interface NotesByDate {
  date: string;            // YYYY-MM-DD
  checkins: Checkin[];
}

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  notesByDate: NotesByDate[] = [];

  constructor(private checkinService: CheckinService) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.checkinService.getByUser(user.id).subscribe((checkins: Checkin[]) => {
      // filtro solo quelli con note non vuote e non null
      const filtered = checkins.filter(c => c.note && c.note.trim().length > 0);

      // raggruppo per data
      const grouped: { [date: string]: Checkin[] } = {};
      filtered.forEach(checkin => {
        const d = checkin.date.split('T')[0]; // YYYY-MM-DD
        if (!grouped[d]) grouped[d] = [];
        grouped[d].push(checkin);
      });

      // converto in array ordinato per data decrescente
      this.notesByDate = Object.entries(grouped)
        .map(([date, checkins]) => ({ date, checkins }))
        .sort((a, b) => b.date.localeCompare(a.date));
    });
  }

  getMoodIcon(mood: number): string {
    switch(mood) {
      case 1: return '😞';
      case 2: return '😐';
      case 3: return '🙂';
      case 4: return '😊';
      case 5: return '🤩';
      default: return '❓';
    }
  }
}
