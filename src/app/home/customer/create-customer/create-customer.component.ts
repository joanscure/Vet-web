import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Firestore, collection, updateDoc } from '@angular/fire/firestore';
import { addDoc, doc, setDoc } from '@firebase/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { v1 as uuidv1 } from 'uuid';
import { LoaderService } from '../../../services/loader.services';
@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent {
  title: string = 'Crear Cliente';
  newData: any = {};
  file: any = null;
  email: string = '';
  constructor(
    public dialogRef: MatDialogRef<CreateCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: AngularFireStorage,
    private loader: LoaderService,
    private firestore: Firestore
  ) {
    if (data.id != '') {
      this.title = 'Editar Cliente';
    }
    this.newData = JSON.parse(JSON.stringify(data));
    this.email = data.email;
  }

  onNoClick(): void {
    this.newData.profile.photoUrl = '';
    this.dialogRef.close();
  }
  async save() {
    this.loader.show();
    let link = this.newData.photoUrl ?? '';
    if (this.file != null) {
      const imageName = uuidv1();

      const filePath = `/customer/${imageName}.jpg`;
      const ref = this.storage.ref(filePath);
      const task = ref.put(this.file);
      await task
        .then((ref) => {
          console.log('Uploaded a blob or file!');
        })
        .catch((err) => {
          console.log(err);
        });

      link = await ref.getDownloadURL().toPromise();
    }
    const newData: any = {
      fullname: this.newData.fullname,
      email: this.newData.email,
      isAdmin: false,
      isVet: false,
      isClient: true,
      profile: {
        email: this.newData.email,
        dni: this.newData.profile.dni,
        notes: this.newData.profile.notes,
        phoneNumber: this.newData.profile.phoneNumber,
        photoUrl: link,
        whatsapp: this.newData.profile.whatsapp,
      },
    };

    let response: any = {};
    if (this.data.id == '') {
      newData.isCreated = false;
      const result = await addDoc(collection(this.firestore, 'users'), newData);

      response = {
        ...newData,
        id: result.id,
      };
    } else {
      newData.isCreated =
        this.email == this.newData.email ? newData.isCreated : false;
      await updateDoc(doc(this.firestore, 'users', this.data.id), newData);

      response = {
        ...newData,
        id: this.data.id,
      };
    }

    this.dialogRef.close(response);
    this.loader.hide();
  }

  generateEmail() {
    this.newData.email = this.newData.profile.dni + '@patita.feliz.com';
  }

  async onInput(event: any) {
    if (!event.target.files[0]) return;
    this.file = event.target.files[0];
    const stringb64 = await this.toBase64(this.file);
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
