import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v1 as uuidv1 } from 'uuid';

import { Firestore, collection, updateDoc } from '@angular/fire/firestore';
import { addDoc, doc, setDoc } from '@firebase/firestore';
import { LoaderService } from '../../../services/loader.services';
import { updatePassword } from '@firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-generate-user',
  templateUrl: './generate-user.component.html',
  styleUrls: ['./generate-user.component.scss'],
})
export class GenerateUserComponent {
  password: string = '';
  newData: any = {};
  file: any = null;
  constructor(
    public dialogRef: MatDialogRef<GenerateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: Firestore,
    private loader: LoaderService,
    public auth: AngularFireAuth
  ) {
    this.newData = { ...data };
    this.generateNew();
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

    await this.auth.createUserWithEmailAndPassword(
      this.newData.email,
      this.password
    );

    await updateDoc(doc(this.firestore, 'users', this.newData.id), {
      isCreated: true,
    });

    this.dialogRef.close({ isCreated: true });

    this.loader.hide();
  }
}
