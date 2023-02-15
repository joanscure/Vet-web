import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v1 as uuidv1 } from 'uuid';

import { Firestore, collection } from '@angular/fire/firestore';
import { addDoc, doc, setDoc } from '@firebase/firestore';
import { LoaderService } from '../../../services/loader.services';
import { updatePassword } from '@firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  password: string = '';
  newData: any = {};
  file: any = null;
  constructor(
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: Firestore,
    private loader: LoaderService,
    public auth: AngularFireAuth
  ) {
    this.newData = { ...data };
  }

  onNoClick(): void {
    this.newData.profile.photoUrl = '';
    this.dialogRef.close();
  }

  generateNew() {
    const pos = this.newData.email.indexOf('@');
    const userName = this.newData.email.substring(0, pos);

    this.password = userName + '1460';
  }

  async save() {
    this.loader.show();

    this.dialogRef.close({ isCreated: true });

    this.loader.hide();
  }
  async onInput(event: any) {
    if (!event.target.files[0]) return;
    this.file = event.target.files[0];
    const stringb64 = await this.toBase64(this.file);
    console.log('stringb64', stringb64);
    this.newData.profile.photoUrl = stringb64;
  }

  toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
}
