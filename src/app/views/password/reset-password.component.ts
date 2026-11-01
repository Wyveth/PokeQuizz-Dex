import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/api/services/auth.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

/** Mêmes règles que l'inscription (Identity) : 6 caractères, minuscule, majuscule, chiffre, caractère spécial. */
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;

function sameAs(group: AbstractControl): ValidationErrors | null {
  const { password, confirm } = group.value as { password: string; confirm: string };
  return password === confirm ? null : { mismatch: true };
}

/** Nouveau mot de passe, depuis le lien reçu par e-mail (?email=…&token=…). */
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe, ReactiveFormsModule, RouterModule]
})
export class ResetPasswordComponent implements OnInit {
  loc = 'FR';
  email = '';
  token = '';

  form = new FormGroup(
    {
      password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(PASSWORD_PATTERN)] }),
      confirm: new FormControl('', { nonNullable: true, validators: Validators.required })
    },
    { validators: sameAs }
  );

  submitting = signal(false);
  done = signal(false);
  error = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => (this.loc = params['loc'] || 'FR'));
    const query = this.route.snapshot.queryParamMap;
    this.email = query.get('email') ?? '';
    this.token = query.get('token') ?? '';
  }

  get linkValid(): boolean {
    return !!this.email && !!this.token;
  }

  submit() {
    if (this.form.invalid || this.submitting() || !this.linkValid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.auth.resetPassword(this.email, this.token, this.form.getRawValue().password).subscribe({
      next: () => {
        this.submitting.set(false);
        this.done.set(true);
      },
      error: err => {
        this.submitting.set(false);
        this.error.set(err.message);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/', this.loc, 'login']);
  }
}
