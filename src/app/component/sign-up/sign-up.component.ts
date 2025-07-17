import { CommonModule } from "@angular/common"
import { ChangeDetectionStrategy, Component, computed, effect, inject, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { AuthService } from "../../service/auth.service"
import { Router } from "@angular/router"
import { Role } from "../../enum/role"
import { type UserInput, validateImputUser } from "../../schema/user"

@Component({
  selector: "app-sign-up",
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent implements OnInit {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  currentError = computed(() => this.authService.authState().error);
  
  private effectRedirectIfLogged = effect(() => {
    if (this.authService.authState().logged) {
      this.router.navigate(['/']);
    }
  });
  
  maxDate = new Date().toISOString().split("T")[0]

  Role = Role

  private dateValidator = (control: any) => {
    if (!control.value) return null

    const inputDate = new Date(control.value)
    const today = new Date()

    if (inputDate >= today) {
      return { invalidDate: true }
    }

    return null
  }

  signupForm: FormGroup = this.fb.group({
    name: ["", [Validators.required]],
    lastname: ["", [Validators.required]],
    birthday: ["", [Validators.required, this.dateValidator]],
    username: ["", [Validators.required, Validators.minLength(4)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
    role: ["", [Validators.required]],
    subscription: [false],
  })

  ngOnInit() {
    this.signupForm.valueChanges.subscribe(() => {
      if (this.currentError()) {
        this.clearError()
      }
    })
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName)
    return !!(field && field.invalid && (field.dirty || field.touched))
  }

  clearError(): void {
    this.authService.authState.update((state) => ({
      ...state,
      error: null,
    }))
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      Object.keys(this.signupForm.controls).forEach((key) => {
        this.signupForm.get(key)?.markAsTouched()
      })
      return
    }

    const formData = this.signupForm.value

    if (typeof formData.birthday === "string") {
      formData.birthday = formData.birthday
    }

    const validation = validateImputUser(formData)

    if (!validation.success) {
      console.error("Validation failed:", validation.issues)
      this.authService.authState.update((state) => ({
        ...state,
        error: "Datos inválidos. Por favor revisa el formulario.",
      }))
      return
    }

    this.authService.register(validation.output as UserInput);
  }
}
