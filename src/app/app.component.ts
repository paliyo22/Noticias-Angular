import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavComponent } from "./component/nav/nav.component";
import { WeatherComponent } from './component/weather/weather.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './service/auth.service';
import { AuthInput } from './schema/user';



@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, NavComponent, 
    WeatherComponent, CommonModule,
    ReactiveFormsModule, RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush   
})
export class AppComponent {
  authService = inject(AuthService)
  private fb = inject(FormBuilder)
  private router = inject(Router)

  showLoginForm = signal(false)

  private isCurrentRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + "?")
  }

  form: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  })

  get currentYear(): number {
    return new Date().getFullYear()
  }

  toggleLoginForm() {
    this.showLoginForm.update((value) => !value)
  }

  closeLoginForm() {
    this.showLoginForm.set(false)
  }

  onSubmit() {
    if (this.form.valid) {
      const aux: AuthInput = this.form.value
      this.authService.logIn(aux)
      this.closeLoginForm()
    }
    if (this.isCurrentRoute("/sign-up")) {
      this.router.navigate(["/"])
    }
  }

  onLogout() {
    this.authService.logOut()
    this.router.navigate(['/'])
  }

  onDocumentClick(event: Event) {
    this.closeLoginForm()
  }
}