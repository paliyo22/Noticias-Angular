import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavComponent } from "./component/nav/nav.component";
import { WeatherComponent } from './component/weather/weather.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './service/auth.service';
import { SessionService } from './service/session.service';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, NavComponent, 
    WeatherComponent, CommonModule,
    ReactiveFormsModule, RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private sessionService = inject(SessionService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  showLoginForm = false;
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isAuthenticated$ = this.sessionService.isLoggedIn();

  toggleLoginForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.logIn(this.form.value).subscribe(() => {
        this.showLoginForm = false;
        location.reload(); // o redirigir a otra vista
      });
    }
  }

  onLogout() {
    this.authService.logOut().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  toggleMobileMenu(){

  }
}