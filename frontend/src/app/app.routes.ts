import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { IndexComponent } from './pages/index/index.component';
import { ThemeComponent } from './pages/theme/theme.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseComponent } from './pages/course/course.component';
import { LessonsComponent } from './pages/lessons/lessons.component';
import { CartComponent } from './pages/cart/cart.component';
import { PayementSuccesComponent } from './pages/payement-succes/payement-succes.component';
import { PayementCancelComponent } from './pages/payement-cancel/payement-cancel.component';
import { LessonComponent } from './pages/lesson/lesson.component';
import { CompteComponent } from './pages/compte/compte.component';

export const routes: Routes = [
  {path: "", component: IndexComponent, title: "Knowledge Learning"},
  {path: "connexion", component: LoginComponent, title: "Connexion | Knowledge Learning"},
  {path: "creer-un-compte", component: RegisterComponent, title: "Créer un compte | Knowledge Learning"},
  {path: "theme/:idTheme", component: ThemeComponent, title: "Thème | Knowledge Learning"},
  {path: "tous-les-cours", component: CoursesComponent, title: "Cours | Knowledge Learning"},
  {path: "cours/:idCours", component: CourseComponent, title: "Leçon | Knowledge Learning"},
  {path: "lecon/:idLesson", component: LessonComponent, title: "Leçon | Knowledge Learning"},
  {path: "lecons", component: LessonsComponent, title: "Leçons | Knowledge Learning"},
  {path: "panier", component: CartComponent, title: "Panier | Knowledge Learning"},
  {path: "payement-succes", component: PayementSuccesComponent, title: "Payement réussi | Knowledge Learning"},
  {path: "payement-cancel", component: PayementCancelComponent, title: "Payement refusé | Knowledge Learning"},
  {path: "compte", component: CompteComponent, title: "Mon compte | Knowledge Learning"},
];
