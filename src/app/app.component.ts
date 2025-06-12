import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./component/nav/nav.component";
import { WeatherComponent } from './component/weather/weather.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, WeatherComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'jugando';

  currentYear = new Date().getFullYear();
  showLoginForm = false;
  showMobileMenu = true;

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
}

