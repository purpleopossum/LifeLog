import { Routes } from '@angular/router';
import { HomePageComponent } from './component/home-page/home-page.component';
import { HabitsComponent } from './component/habits/habits.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { NotesComponent } from './component/notes/notes.component';
import { JournalComponent } from './component/journal/journal.component';


export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'habits', component: HabitsComponent, canActivate: [AuthGuard] },
  { path: 'notes', component: NotesComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'journal', component: JournalComponent, canActivate: [NoAuthGuard] }
];


