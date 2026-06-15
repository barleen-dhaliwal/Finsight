import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { SignUpRequest } from '../../core/auth/auth.model';

@Component({
  selector: 'app-sign-up',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  private readonly fb = inject(FormBuilder);
  readonly signUpForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    },
    {
      validators: (group) => {
        const password = group.get('password')?.value;
        const confirm = group.get('confirmPassword')?.value;
        return password === confirm ? null : { passwordMismatch: true };
      },
    }
  );
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  showPassword = false;
  onSubmit() {
    if (this.signUpForm.valid) {
      const payload = this.signUpForm.value;
      delete payload.confirmPassword;

      this.authService.signUp(payload as SignUpRequest).subscribe({
        next: (_) => {
          this.router.navigate(['/app/dashboard']);
        },
      });
    }
  }
}
