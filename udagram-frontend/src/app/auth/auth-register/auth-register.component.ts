import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AuthRegisterComponent implements OnInit {
  registerForm!: FormGroup;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private modal: ModalController
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      password_confirm: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+$')
      ]))
    }, { validators: this.passwordsMatch });
  }

  onSubmit($event: Event) {
    $event.preventDefault();

    if (!this.registerForm.valid) { return; }

    const newuser: User = {
      email: this.registerForm.controls['email'].value,
      name: this.registerForm.controls['name'].value
    };

    this.auth.register(newuser, this.registerForm.controls['password'].value)
      .then((user) => {
        this.modal.dismiss();
      })
      .catch((e) => {
        this.error = e.statusText;
        throw e;
      });
  }

  passwordsMatch(group: FormGroup) {
    return group.controls['password'].value === group.controls['password_confirm'].value 
      ? null 
      : { passwordsMisMatch: true };
  }
}