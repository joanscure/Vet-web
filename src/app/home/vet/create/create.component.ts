import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v1 as uuidv1 } from 'uuid';

import { Firestore, collection } from '@angular/fire/firestore';
import { addDoc, doc, setDoc } from '@firebase/firestore';
import { LoaderService } from '../../../services/loader.services';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateVetComponent {
  title: string = 'Crear Veterinario';
  newData: any = {};
  file: any = null;
  constructor(
    public dialogRef: MatDialogRef<CreateVetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: Firestore,
    private loader: LoaderService,
    private storage: AngularFireStorage
  ) {
    if (data.id != '') {
      this.title = 'Editar Veterinario';
    }
    this.newData = { ...data };
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

      const filePath = `/vet/${imageName}.jpg`;
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
    const newData = {
      fullname: this.newData.fullname,
      email: this.newData.email,
      isAdmin: false,
      isVet: true,
      isClient: false,
      profile: {
        email: this.newData.email,
        notes: this.newData.profile.notes,
        phoneNumber: this.newData.profile.phoneNumber,
        photoUrl: link,
        specialist: this.newData.profile.specialist,
        whatsapp: this.newData.profile.whatsapp,
      },
    };

    let response: any = {};
    if (this.data.id == '') {
      const result = await addDoc(collection(this.firestore, 'users'), newData);

      response = {
        ...newData,
        id: result.id,
      };
    } else {
      await setDoc(doc(this.firestore, 'users', this.data.id), newData);

      response = {
        ...newData,
        id: this.data.id,
      };
    }

    this.dialogRef.close(response);

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
