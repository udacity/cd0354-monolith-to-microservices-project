import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarComponent } from './menubar/menubar.component';
import { environment } from '../environments/environment';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    MenubarComponent
  ]
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    }
  ];

  public appName = environment.appName;

  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    
    // Only try to use Capacitor plugins on mobile platforms
    if (this.platform.is('capacitor')) {
      try {
        await StatusBar.setBackgroundColor({ color: '#3880ff' });
        await SplashScreen.hide();
      } catch (err) {
        console.warn('Capacitor plugins not available', err);
      }
    }
    document.title = environment.appName;
  }
}