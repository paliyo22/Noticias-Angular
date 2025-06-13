import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserOutput, UserInput } from '../../schema/user';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  user!: UserOutput;
  editMode = false;

  userForm!: FormGroup;
  passwordForm!: FormGroup;

  ngOnInit(): void {
    this.userService.getInfo().subscribe(user => {
      this.user = user;
      this.initUserForm(user);
    });

    this.passwordForm = this.fb.group({
      oldPass: ['', [Validators.required]],
      newPass: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  initUserForm(user: UserOutput): void {
    this.userForm = this.fb.group({
      name: [user.name, Validators.required],
      lastname: [user.lastname, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      birthday: [new Date(user.birthday).toISOString().split('T')[0], Validators.required],
      subscription: [user.subscription]
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  updateUser(): void {
    if (this.userForm.invalid) return;

    const updated: Partial<UserInput> = this.userForm.value;
    this.userService.update(updated).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.toggleEditMode();
      },
      error: (err) => console.error('Error actualizando usuario', err)
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    const { oldPass, newPass } = this.passwordForm.value;
    this.authService.newPassword(oldPass, newPass).subscribe({
      next: () => {
        this.passwordForm.reset();
        alert('Contraseña actualizada correctamente');
      },
      error: (err) => console.error('Error cambiando contraseña', err)
    });
  }
}
