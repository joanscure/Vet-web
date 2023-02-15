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
  listVets: any[] = [];
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
    this.listVets = data.vets;
    this.newData.vet = data.assignedId ?? '';
    this.newData.date = new Date(data.date);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  async save() {
    const date = new Date(this.newData.date).getTime();
    const vet = this.listVets.find((x) => x.id === this.newData.vet);

    const newData = {
      reason: this.newData.reason,
      notes: this.newData.notes,
      date: date,
      assignedName: vet ? vet.fullname : '',
      userId: this.newData.userId,
      assignedId: this.newData.vet ?? '',
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

      await setDoc(doc(this.firestore, 'appointments', result.id), {
        ...newData,
        petName: this.newData.pet,
        petId: this.newData.petId,
        isApproved: true,
        isClose: false,
      });
    } else {
      const refCol = doc(
        doc(this.firestore, 'pets', this.newData.petId),
        'events',
        this.newData.id
      );
      await setDoc(refCol, newData);
      response = {
        ...newData,
        id: this.data.id,
      };

      await setDoc(doc(this.firestore, 'appointments', this.data.id), {
        ...newData,
        petName: this.newData.pet,
        petId: this.newData.petId,
      });
    }

    this.dialogRef.close(response);
  }
}
