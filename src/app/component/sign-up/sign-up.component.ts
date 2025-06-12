import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    subscribeNewsletter: false
  };

  showPassword = false;
  formSubmitted = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  getPasswordStrengthClass(): string {
    if (!this.user.password) return '';
    
    const hasUpperCase = /[A-Z]/.test(this.user.password);
    const hasLowerCase = /[a-z]/.test(this.user.password);
    const hasNumbers = /\d/.test(this.user.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.user.password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (this.user.password.length < 8) return 'weak';
    if (strength <= 2) return 'weak';
    if (strength === 3) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strengthClass = this.getPasswordStrengthClass();
    if (strengthClass === 'weak') return 'Débil';
    if (strengthClass === 'medium') return 'Media';
    if (strengthClass === 'strong') return 'Fuerte';
    return '';
  }

  onSubmit() {
    this.formSubmitted = true;
    
    // Validación básica
    if (
      !this.user.firstName ||
      !this.user.lastName ||
      !this.user.email ||
      !this.isValidEmail(this.user.email) ||
      !this.user.password ||
      this.user.password.length < 8 ||
      this.user.password !== this.user.confirmPassword ||
      !this.user.acceptTerms
    ) {
      return;
    }
    
    // Aquí iría la lógica para enviar los datos al servidor
    console.log('Formulario enviado:', this.user);
    
    // Redireccionar al usuario
    this.router.navigate(['/']);
  }
}
