import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AuthLoginComponent implements OnInit {
  loginForm!: FormGroup<LoginForm>;
  error: string = '';

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private auth: AuthService,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group<LoginForm>({
      password: new FormControl('', { 
        nonNullable: true, 
        validators: Validators.required 
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ]
      })
    });
  }

  async onSubmit(event: Event) {
    event.preventDefault();

    if (!this.loginForm.valid) { return; }

    try {
      await this.auth.login(
        this.loginForm.controls.email.value,
        this.loginForm.controls.password.value
      );
      await this.modal.dismiss();
    } catch (err: any) {
      this.error = err.statusText || 'An error occurred during login';
      throw err;
    }
  }
}