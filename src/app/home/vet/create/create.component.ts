import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Firestore, collection } from '@angular/fire/firestore';
import { addDoc, doc, setDoc } from '@firebase/firestore';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateVetComponent {
  title: string = 'Crear Veterinario';
  newData: any = {};
  constructor(
    public dialogRef: MatDialogRef<CreateVetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: Firestore
  ) {
    if (data.id != '') {
      this.title = 'Editar Veterinario';
    }
    this.newData = { ...data };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  async save() {
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
        photoUrl: '',
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
  }
}
