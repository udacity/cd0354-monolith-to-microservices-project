import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FeedItem } from '../models/feed-item.model';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedItemComponent {
  @Input() feedItem!: FeedItem;
}