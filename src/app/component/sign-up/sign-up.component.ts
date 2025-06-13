import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule, 
    ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  showPassword = false;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(4)]],
      birthday: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { notMatching: true };
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrengthText(): string {
    const pass = this.signupForm.get('password')?.value || '';
    if (pass.length < 8) return 'Débil';
    if (/[A-Z]/.test(pass) && /\d/.test(pass)) return 'Fuerte';
    return 'Media';
  }

  getPasswordStrengthClass(): string {
    const pass = this.signupForm.get('password')?.value || '';
    if (pass.length < 8) return 'weak';
    if (/[A-Z]/.test(pass) && /\d/.test(pass)) return 'strong';
    return 'medium';
  }

  onSubmit(): void {
  this.formSubmitted = true;

  if (this.signupForm.invalid) return;

  const { confirmPassword, ...formValue } = this.signupForm.value;

  // ✅ Asegurarse de que birthday sea un Date real
  const payload = {
  ...formValue, // Conversión a Date
  subscription: false,
  role: 'user',
  is_active: true
};
  console.log(this.signupForm.value);

  this.authService.register(payload).subscribe({
    next: () => this.router.navigate(['/']),
    error: (err) => console.error('Registro fallido', err)
  });
}

}
