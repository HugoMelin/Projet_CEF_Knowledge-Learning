import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  {path: "connexion", component: LoginComponent, title: "Connexion | Knowledge Learning"},
  {path: "creer-un-compte", component: RegisterComponent, title: "Créer un compte | Knowledge Learning"}
];
