import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticateUser } from 'src/app/api/models/concretes/authenticate-user';
import { AuthenticateService } from 'src/app/api/services/authenticate.service';
import { LocService } from 'src/app/api/services/loc.service';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginComponent extends BaseComponent implements OnInit {
  form!: FormGroup;
  loc!: string;

  constructor(
    resources: AppResource,
    private locService: LocService,
    private authenticateService: AuthenticateService
  ) {
    super(resources);

    this.locService.loc$.subscribe((loc: string) => {
      this.loc = loc;
    });
  }
  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  login() {
    const body = {
      email: this.form.value.email,
      password: this.form.value.password,
      token: '',
      userName: '',
    } as AuthenticateUser;
    this.authenticateService.login(body).subscribe((response) => {
      localStorage.setItem('token', response.token);
    });
  }
}
