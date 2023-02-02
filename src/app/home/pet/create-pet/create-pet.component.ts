import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Firestore, collection } from '@angular/fire/firestore';
import { addDoc, doc, setDoc } from '@firebase/firestore';

@Component({
  selector: 'app-create-pet',
  templateUrl: './create-pet.component.html',
  styleUrls: ['./create-pet.component.scss'],
})
export class CreatePetComponent {
  title: string = 'Crear Mascota';
  newData: any = {};
  types: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<CreatePetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: Firestore
  ) {
    if (data.id != '') {
      this.title = 'Editar Mascota';
    }
    this.newData = { ...data.pet };
    this.types = [...data.types];
    console.log(this.types);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  async save() {
    const date = new Date(this.newData.birthdateFormat);
    const newData = {
      birthdate: date.getTime(),
      breed: this.newData.breed,
      gender: this.newData.gender,
      name: this.newData.name,
      petType: this.newData.petType,
      photoUrl: '',
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

    this.dialogRef.close(response);
  }
}
