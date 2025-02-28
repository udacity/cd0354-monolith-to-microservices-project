import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AuthMenuButtonComponent } from '../auth/auth-menu-button/auth-menu-button.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    AuthMenuButtonComponent
  ]
})
export class MenubarComponent {
  public appName = environment.appName;
}