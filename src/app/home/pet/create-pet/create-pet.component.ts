import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Firestore, collection } from '@angular/fire/firestore';
import { addDoc, doc, setDoc } from '@firebase/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v1 as uuidv1 } from 'uuid';
import { LoaderService } from '../../../services/loader.services';

@Component({
  selector: 'app-create-pet',
  templateUrl: './create-pet.component.html',
  styleUrls: ['./create-pet.component.scss'],
})
export class CreatePetComponent {
  title: string = 'Crear Mascota';
  newData: any = {};
  types: any[] = [];
  file: any = null;
  constructor(
    public dialogRef: MatDialogRef<CreatePetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: AngularFireStorage,
    private loader: LoaderService,
    private firestore: Firestore
  ) {
    if (data.id != '') {
      this.title = 'Editar Mascota';
    }
    this.newData = { ...data.pet };
    this.newData.birthdateFormat = new Date(data.pet.birthdate);
    this.types = [...data.types];
  }

  onNoClick(): void {
    this.newData.photoUrl = '';
    this.dialogRef.close();
  }
  async save() {
    this.loader.show();
    let link = this.newData.photoUrl ?? '';
    if (this.file != null) {
      const imageName = uuidv1();

      const filePath = `/pet/${imageName}.jpg`;
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
    const date = new Date(this.newData.birthdateFormat);
    const newData = {
      birthdate: date.getTime(),
      breed: this.newData.breed,
      gender: this.newData.gender,
      name: this.newData.name,
      petType: this.newData.petType,
      photoUrl: link,
      userId: this.newData.userId,
    };

    let response: any = {};
    if (this.data.pet.id == '') {
      const result = await addDoc(collection(this.firestore, 'pets'), newData);

      response = {
        ...newData,
        id: result.id,
      };
    } else {
      await setDoc(doc(this.firestore, 'pets', this.data.pet.id), newData);

      response = {
        ...newData,
        id: this.data.pet.id,
      };
    }

    this.loader.hide();
    this.dialogRef.close(response);
  }

  async onInput(event: any) {
    if (!event.target.files[0]) return;
    this.file = event.target.files[0];
    const stringb64 = await this.toBase64(this.file);
    this.newData.photoUrl = stringb64;
  }

  toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
}
