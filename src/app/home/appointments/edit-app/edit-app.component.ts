import { Component, Inject } from '@angular/core';
import { Firestore, updateDoc } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { doc, setDoc } from '@firebase/firestore';

@Component({
  selector: 'app-edit-app',
  templateUrl: './edit-app.component.html',
  styleUrls: ['./edit-app.component.scss'],
})
export class EditAppComponent {
  listVets: any[] = [];
  newData: any = {};
  constructor(
    public dialogRef: MatDialogRef<EditAppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firestore: Firestore
  ) {
    this.newData = { ...data };
    this.listVets = data.vets;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  async save() {
    const vet = this.listVets.find((x) => x.id === this.newData.vet);

    const newData = {
      assignedId: this.newData.vet ?? '',
      assignedName: vet ? vet.fullname : '',
      notes: this.newData.notes,
    };

    await updateDoc(doc(this.firestore, 'appointments', this.data.id), {
      ...newData,
    });

    this.dialogRef.close(newData);
  }
}
