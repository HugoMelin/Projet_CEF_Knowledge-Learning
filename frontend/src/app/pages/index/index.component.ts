import { Component } from '@angular/core';
import { ThemeCardComponent } from '../../components/theme-card/theme-card.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ ThemeCardComponent ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

}
