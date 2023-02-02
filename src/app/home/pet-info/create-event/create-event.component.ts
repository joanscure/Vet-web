import { Component, Inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { addDoc, collection, doc, setDoc } from '@firebase/firestore';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent {
  title: string = 'Crear Evento';
  newData: any = {};
  constructor(
    public dialogRef: MatDialogRef<CreateEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: Firestore
  ) {
    if (data.id != '') {
      this.title = 'Editar Evento';
    }
    this.newData = { ...data };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  async save() {
    const date = new Date(this.newData.date).getTime();
    const newData = {
      reason: this.newData.reason,
      notes: this.newData.notes,
      date: date,
    };

    let response: any = {};
    if (this.data.id == '') {
      const refCol = collection(
        doc(this.firestore, 'pets', this.newData.petId),
        'events'
      );
      const result = await addDoc(refCol, newData);

      response = {
        ...newData,
        id: result.id,
      };
    } else {
      //await setDoc(doc(this.firestore, 'users', this.data.id), newData);

      response = {
        ...newData,
        id: this.data.id,
      };
    }

    this.dialogRef.close(response);
  }
}
