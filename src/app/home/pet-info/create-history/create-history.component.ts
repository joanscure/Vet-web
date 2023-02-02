import { Component, Inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { addDoc, collection, doc, setDoc } from '@firebase/firestore';

@Component({
  selector: 'app-create-history',
  templateUrl: './create-history.component.html',
  styleUrls: ['./create-history.component.scss'],
})
export class CreateHistoryComponent {
  title: string = 'Crear Historia';
  newData: any = {};
  constructor(
    public dialogRef: MatDialogRef<CreateHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: Firestore
  ) {
    if (data.id != '') {
      this.title = 'Editar Historia';
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
      date: date,
      anamnesis: this.newData.anamnesis,
      diagnostic: this.newData.diagnostic,
      treatment: this.newData.treatment,
      images: [],
    };

    let response: any = {};
    if (this.data.id == '') {
      const refCol = collection(
        doc(this.firestore, 'pets', this.newData.petId),
        'histories'
      );
      const result = await addDoc(refCol, newData);

      response = {
        ...newData,
        id: result.id,
      };
    } else {
      response = {
        ...newData,
        id: this.data.id,
      };
    }

    this.dialogRef.close(response);
  }
}
