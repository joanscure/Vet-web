import { Component, Inject } from '@angular/core';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { addDoc, collection } from '@firebase/firestore';

@Component({
  selector: 'app-create-type',
  templateUrl: './create-type.component.html',
  styleUrls: ['./create-type.component.scss'],
})
export class CreateTypeComponent {
  title: string = 'Crear Tipo';
  newData: any = {};
  constructor(
    public dialogRef: MatDialogRef<CreateTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: Firestore
  ) {
    if (data.id != '') {
      this.title = 'Editar Tipo';
    }
    this.newData = { ...data };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  async save() {
    const newData = {
      name: this.newData.name,
    };

    let response: any = {};
    if (this.data.id == '') {
      const result = await addDoc(
        collection(this.firestore, 'typeAnimal'),
        newData
      );

      response = {
        ...newData,
        id: result.id,
      };
    } else {
      await setDoc(doc(this.firestore, 'typeAnimal', this.data.id), newData);

      response = {
        ...newData,
        id: this.data.id,
      };
    }

    this.dialogRef.close(response);
  }
}
