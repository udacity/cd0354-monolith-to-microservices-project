import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FeedUploadComponent } from '../feed-upload.component';
import { AuthService } from '../../../auth/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feed-upload-button',
  templateUrl: './feed-upload-button.component.html',
  styleUrls: ['./feed-upload-button.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class FeedUploadButtonComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  loginSub?: Subscription;

  constructor(
    private modalController: ModalController,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.loginSub = this.auth.currentUser$.subscribe((user) => {
      this.isLoggedIn = user !== null;
    });
  }

  ngOnDestroy() {
    this.loginSub?.unsubscribe();
  }

  async presentUploadForm() {
    const modal = await this.modalController.create({
      component: FeedUploadComponent,
    });
    return await modal.present();
  }
}