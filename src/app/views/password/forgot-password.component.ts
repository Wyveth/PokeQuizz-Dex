import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/api/services/auth.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

/** Mot de passe oublié : demande d'un lien de réinitialisation par e-mail. */
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe, ReactiveFormsModule, RouterModule]
})
export class ForgotPasswordComponent implements OnInit {
  loc = 'FR';
  form = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] })
  });

  submitting = signal(false);
  sent = signal(false);
  error = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => (this.loc = params['loc'] || 'FR'));
    // Adresse déjà saisie sur la page de connexion
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) this.form.controls.email.setValue(email);
  }

  submit() {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.auth.forgotPassword(this.form.getRawValue().email, this.loc).subscribe({
      next: () => {
        this.submitting.set(false);
        this.sent.set(true);
      },
      error: err => {
        this.submitting.set(false);
        this.error.set(err.message);
      }
    });
  }
}
