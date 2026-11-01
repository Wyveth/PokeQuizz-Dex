import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/api/services/auth.service';
import { TranslatePipe } from 'src/app/i18n/translate.pipe';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe, ReactiveFormsModule, RouterModule]
})
export class LoginComponent implements OnInit {
  loc = 'FR';
  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', { nonNullable: true, validators: Validators.required })
  });

  submitting = signal(false);
  error = signal<string | null>(null);

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => (this.loc = params['loc'] || 'FR'));
  }

  login() {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => this.goBack(),
      error: err => {
        this.error.set(err.message);
        this.submitting.set(false);
      }
    });
  }

  logout() {
    this.auth.logout().subscribe();
  }

  /** Retour à la page qui a demandé la connexion (ex. les duels), sinon au Pokédex. */
  private goBack() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl && returnUrl.startsWith('/')) this.router.navigateByUrl(returnUrl);
    else this.router.navigate(['/', this.loc, 'pokedex']);
  }
}
