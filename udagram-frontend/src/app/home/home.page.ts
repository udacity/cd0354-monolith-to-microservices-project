import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FeedUploadButtonComponent } from '../feed/feed-upload/feed-upload-button/feed-upload-button.component';
import { FeedListComponent } from '../feed/feed-list/feed-list.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FeedUploadButtonComponent,
    FeedListComponent
  ]
})
export class HomePage {
  appName = environment.appName;
}