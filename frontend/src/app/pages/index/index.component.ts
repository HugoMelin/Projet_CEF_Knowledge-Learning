import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeCardComponent } from '../../components/theme-card/theme-card.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ ThemeCardComponent, CommonModule ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit, OnDestroy {
  errorMessage: string | null = null;
  popupTimeout:any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['error']) {
        this.errorMessage = params['error'];
        this.popupTimeout = setTimeout(() => this.closeErrorPopup(), 5000);
      }
    });
  }

  closeErrorPopup() {
    this.errorMessage = null;
    if(this.popupTimeout) {
      clearTimeout(this.popupTimeout);
    }
  }

  ngOnDestroy() {
    if(this.popupTimeout) {
      clearTimeout(this.popupTimeout);
    }
  }
}
