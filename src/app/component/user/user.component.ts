import { ChangeDetectionStrategy, Component, inject, type OnInit, signal, computed, effect } from "@angular/core"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators, type AbstractControl } from "@angular/forms"
import type { UserInput } from "../../schema/user"
import { AuthService } from "../../service/auth.service"
import { UserService } from "../../service/user.service"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"

@Component({
  selector: "app-user",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./user.component.html",
  styleUrl: "./user.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  // --- CONSTANTES Y SEÑALES ---
  userService = inject(UserService);
  authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Estado del componente
  editMode = signal(false);
  passwordMode = signal(false);
  dropdownOpen = signal(false);

  // Formularios reactivos
  userForm!: FormGroup;
  passwordForm!: FormGroup;

  // Computed signals
  isLoading = computed(() => this.userService.userState().user.loading);
  userError = computed(() => this.userService.userState().user.error);
  userData = computed(() => this.userService.userState().user.data);
  authError = computed(() => this.authService.authState().error);
  authLoading = computed(() => this.authService.authState().loading);

  // --- MÉTODOS DE LÓGICA DEL PROGRAMA ---
  logState = effect(() => {
    if (!this.authService.authState().logged) {
      this.router.navigate(['/']);
    }
  });

  closeEditEffect = effect(() => {
    if (!this.isLoading() && !this.userError()) {
      this.editMode.set(false);
    }
  });

  closePasswordEffect = effect(() => {
    if (!this.authLoading() && !this.authError()) {
      this.passwordMode.set(false);
      this.passwordForm.reset();
    }
  });

  ngOnInit() {
    this.initializeForms();
    this.loadUserData();
    this.setupClickOutside();
  }

  loadUserData() {
    this.userService.getInfo();
  }

  private initializeForms() {
    this.userForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(4)]],
      email: ["", [Validators.required, Validators.email]],
      name: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      birthday: [""],
      subscription: [false],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ["", [Validators.required]],
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    const newPassword = control.get("newPassword");
    const confirmPassword = control.get("confirmPassword");

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    return null;
  }

  private setupClickOutside() {
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const dropdown = target.closest(".dropdown");
      if (!dropdown && this.dropdownOpen()) {
        this.dropdownOpen.set(false);
      }
    });
  }

  private populateUserForm() {
    const user = this.userData();
    if (user) {
      this.userForm.patchValue({
        username: user.username,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        birthday: user.birthday ? new Date(user.birthday).toISOString().split("T")[0] : "",
        subscription: user.subscription,
      });
    }
  }

  // --- MÉTODOS DE LÓGICA DEL HTML Y LOS FORMULARIOS ---
  toggleDropdown() {
    this.dropdownOpen.set(!this.dropdownOpen());
  }

  enableEditMode() {
    this.editMode.set(true);
    this.passwordMode.set(false);
    this.dropdownOpen.set(false);
    this.populateUserForm();
  }

  enablePasswordMode() {
    this.passwordMode.set(true);
    this.editMode.set(false);
    this.dropdownOpen.set(false);
    this.passwordForm.reset();
  }

  cancelEdit() {
    this.editMode.set(false);
    this.userForm.reset();
    this.populateUserForm();
  }

  cancelPasswordChange() {
    this.passwordMode.set(false);
    this.passwordForm.reset();
  }

  updateUser() {
    if (!this.userForm.valid || this.isLoading()) return;

    const formData = this.userForm.value;
    const userData: Partial<UserInput> = Object.fromEntries(
      Object.entries({
        ...formData,
        birthday: formData.birthday || undefined,
      }).filter(([_, v]) => v !== "" && v !== undefined)
    );

    this.userService.update(userData);    
  }

  changePassword() {
    if (this.passwordForm.valid && !this.authLoading()) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.authService.newPassword(currentPassword, newPassword);
    }
  }

  deleteAccount() {
    if (confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      this.userService.delete();
      this.authService.logOut();
    }

  }

  // Getters para usar en el template
  get isFormValid() {
    return this.userForm.valid;
  }

  get isPasswordFormValid() {
    return this.passwordForm.valid;
  }

  get hasUserData() {
    return !!this.userData();
  }

  get hasError() {
    return !!this.userError();
  }

  get hasAuthError() {
    return !!this.authError();
  }
}
