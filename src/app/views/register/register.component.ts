import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/api/services/auth.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

/** Règles de mot de passe par défaut d'ASP.NET Identity : 6 caractères, minuscule, majuscule, chiffre et caractère spécial. */
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

function sameAsPassword(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return confirm && password !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe, CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent implements OnInit {
  loc = 'FR';
  form = new FormGroup(
    {
      userName: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(24),
          Validators.pattern(/^[A-Za-z0-9._-]+$/)
        ]
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(PASSWORD_PATTERN)]
      }),
      confirm: new FormControl('', { nonNullable: true, validators: Validators.required })
    },
    { validators: sameAsPassword }
  );

  submitting = signal(false);
  error = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => (this.loc = params['loc'] || 'FR'));
  }

  invalid(name: 'userName' | 'email' | 'password' | 'confirm'): boolean {
    const control = this.form.controls[name];
    return control.touched && control.invalid;
  }

  register() {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);

    const { userName, email, password } = this.form.getRawValue();
    this.auth.register(userName, email, password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl && returnUrl.startsWith('/')) this.router.navigateByUrl(returnUrl);
        else this.router.navigate(['/', this.loc, 'duel']);
      },
      error: err => {
        this.error.set(err.message);
        this.submitting.set(false);
      }
    });
  }
}
