import { Routes } from '@angular/router';
import { HabitsComponent } from './component/habits/habits.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { NotesComponent } from './component/notes/notes.component';
import { JournalComponent } from './component/journal/journal.component';
import { StatsComponent } from './component/stats/stats.component';
import { ChallengeComponent } from './component/challenge/challenge.component';
import { PremadeHabitsComponent } from './component/premade-habits/premade-habits.component';


export const routes: Routes = [
  { path: 'habit', component: HabitsComponent, canActivate: [AuthGuard] },
  { path: 'notes', component: NotesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'journal', component: JournalComponent, canActivate: [AuthGuard] },
  { path: 'stats', component: StatsComponent, canActivate: [AuthGuard] },
  { path: 'challenges', component: ChallengeComponent, canActivate: [AuthGuard] },
  { path: 'premade-habits', component: PremadeHabitsComponent, canActivate: [AuthGuard] },

  { path: '**', component: HabitsComponent, canActivate: [AuthGuard] }
];


