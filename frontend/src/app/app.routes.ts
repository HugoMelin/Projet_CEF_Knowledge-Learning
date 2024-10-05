import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { IndexComponent } from './pages/index/index.component';

export const routes: Routes = [
  {path: "", component: IndexComponent, title: "Knowledge Learning"},
  {path: "connexion", component: LoginComponent, title: "Connexion | Knowledge Learning"},
  {path: "creer-un-compte", component: RegisterComponent, title: "Créer un compte | Knowledge Learning"}
];
