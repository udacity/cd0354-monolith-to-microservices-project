import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, LoadingController, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FeedProviderService } from '../services/feed.provider.service';

@Component({
  selector: 'app-feed-upload',
  templateUrl: './feed-upload.component.html',
  styleUrls: ['./feed-upload.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class FeedUploadComponent implements OnInit {
  previewDataUrl: string | ArrayBuffer | null = null;
  file: File | null = null;
  uploadForm!: FormGroup;

  constructor(
    private feed: FeedProviderService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      caption: new FormControl('', Validators.required)
    });
  }

  setPreviewDataUrl(file: Blob) {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.previewDataUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  selectImage(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList) {
      this.file = fileList[0];
      this.setPreviewDataUrl(this.file);
    }
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    const loading = await this.loadingController.create();
    await loading.present();

    if (!this.uploadForm.valid || !this.file) { return; }

    try {
      await this.feed.uploadFeedItem(this.uploadForm.controls['caption'].value, this.file);
      await this.modalController.dismiss();
    } finally {
      await loading.dismiss();
    }
  }

  cancel() {
    this.modalController.dismiss();
  }
}