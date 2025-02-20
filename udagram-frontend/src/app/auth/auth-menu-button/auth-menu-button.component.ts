import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthMenuUserComponent } from './auth-menu-user/auth-menu-user.component';
import { AuthService } from '../services/auth.service';
import { AuthLoginComponent } from '../auth-login/auth-login.component';
import { AuthRegisterComponent } from '../auth-register/auth-register.component';

@Component({
  selector: 'app-auth-menu-button',
  templateUrl: './auth-menu-button.component.html',
  styleUrls: ['./auth-menu-button.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class AuthMenuButtonComponent {
  constructor(
    public auth: AuthService,
    public modalController: ModalController
  ) {}

  async presentmodal() {
    const modal = await this.modalController.create({
      component: AuthMenuUserComponent,
    });
    return await modal.present();
  }

  async presentLogin() {
    const modal = await this.modalController.create({
      component: AuthLoginComponent,
    });
    return await modal.present();
  }

  async presentRegister() {
    const modal = await this.modalController.create({
      component: AuthRegisterComponent,
    });
    return await modal.present();
  }

  logout() {
    this.auth.logout();
  }
}