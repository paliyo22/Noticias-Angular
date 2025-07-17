import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
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
export class AppComponent implements OnInit {
  authService = inject(AuthService)
  private fb = inject(FormBuilder)
  private router = inject(Router)

  showLoginForm = signal(false)

  form: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  })

  get currentYear(): number {
    return new Date().getFullYear()
  }

  ngOnInit() {
    this.authService.refresh();
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
  }

  onLogout() {
    this.authService.logOut()
    this.router.navigate(['/'])
  }

  onDocumentClick(event: Event) {
    this.closeLoginForm()
  }
}