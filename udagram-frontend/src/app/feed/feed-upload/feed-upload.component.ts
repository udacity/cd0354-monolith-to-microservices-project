import { Component, OnInit } from '@angular/core';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FeedProviderService } from '../services/feed.provider.service';

import { LoadingController, ModalController } from '@ionic/angular';


@Component({
  selector: 'app-feed-upload',
  templateUrl: './feed-upload.component.html',
  styleUrls: ['./feed-upload.component.scss'],
})
export class FeedUploadComponent implements OnInit {
  previewDataUrl;
  file: File;
  uploadForm: FormGroup;

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
    const reader  = new FileReader();
    reader.onloadend = () => {
      this.previewDataUrl = reader.result;
    };

    reader.readAsDataURL(file);
  }

  selectImage(event) {
    const file = event.srcElement.files;

    if (!file) {
      return;
    }
    this.file = file[0];
    this.setPreviewDataUrl(this.file);

  }

  onSubmit($event) {
    console.log('test');
    $event.preventDefault();
    this.loadingController.create();
    console.log('test2');

    console.log('this.uploadForm.valid', this.uploadForm.valid);
    console.log('this.file', this.file);

    if (!this.uploadForm.valid || !this.file) { return; }
    console.log('passed');
    this.feed.uploadFeedItem(this.uploadForm.controls.caption.value, this.file)
      .then((result) => {
        console.log('not err');
        this.modalController.dismiss();
        this.loadingController.dismiss();
      })
      .catch((e) => {
        console.log('terrfsihfisdbf');
        console.log(e);
        throw e;
       });
  }

  cancel() {
    this.modalController.dismiss();
  }
}
