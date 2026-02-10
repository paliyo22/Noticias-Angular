import { CommonModule } from "@angular/common"
import { ChangeDetectionStrategy, Component, computed, inject, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { AuthService } from "../../service/auth.service"
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

  currentError = computed(() => this.authService.authState().error);
  
  maxDate = new Date().toISOString().split("T")[0]

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
