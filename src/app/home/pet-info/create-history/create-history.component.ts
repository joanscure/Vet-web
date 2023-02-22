import { Component, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Firestore, updateDoc } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { addDoc, collection, doc, setDoc } from '@firebase/firestore';
import { v1 as uuidv1 } from 'uuid';
import { LoaderService } from '../../../services/loader.services';

@Component({
  selector: 'app-create-history',
  templateUrl: './create-history.component.html',
  styleUrls: ['./create-history.component.scss'],
})
export class CreateHistoryComponent {
  title: string = 'Crear Historia';
  newData: any = {};
  listVets: any[] = [];
  images: any[] = [];
  listStatus: string[] = [
    'SALUDABLE',
    'INTERNADO/EMERGENCIA',
    'TRATAMIENTO',
    'EN OBSERVACION',
  ];
  constructor(
    public dialogRef: MatDialogRef<CreateHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: AngularFireStorage,
    private loader: LoaderService,
    private firestore: Firestore
  ) {
    this.newData = { ...data };
    if (data.id != '') {
      this.title = 'Editar Historia';
    } else {
      this.newData.status = 'SALUDABLE';
    }
    this.listVets = data.vets;
    this.newData.vet = data.assignedId ?? '';
    this.newData.date = new Date(data.date);
  }

  onNoClick(): void {
    this.images = [];
    this.newData.images = [];
    this.dialogRef.close();
  }
  async save() {
    this.loader.show();
    let newImages = this.newData.images.filter(
      (img: string) => img.indexOf('data') < 0
    );
    if (this.images.length !== 0) {
      for (const file of this.images) {
        const imageName = uuidv1();

        const filePath = `/histories/${imageName}.jpg`;
        const ref = this.storage.ref(filePath);
        const task = ref.put(file);
        await task.then((ref: any) => {
          console.log('Uploaded a blob or file!');
        });

        let link = await ref.getDownloadURL().toPromise();
        newImages.push(link);
      }
    }
    const date = new Date(this.newData.date).getTime();

    const vet = this.listVets.find((x) => x.id === this.newData.vet);
    const newData = {
      reason: this.newData.reason,
      date: date,
      anamnesis: this.newData.anamnesis,
      status: this.newData.status,
      diagnostic: this.newData.diagnostic,
      treatment: this.newData.treatment,
      images: newImages,
      assignedName: vet ? vet.fullname : '',
      assignedId: this.newData.vet ?? '',
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

      await updateDoc(doc(this.firestore, 'pets', this.newData.petId), {
        status: newData.status,
      });

      await setDoc(doc(this.firestore, 'appointments', result.id), {
        assignedName: vet ? vet.fullname : '',
        assignedId: this.newData.vet ?? '',
        date: date,
        userId: this.newData.userId,
        reason: `El estado de su mascota esta en: '${this.newData.status}' `,
        notes: this.newData.reason,
        petName: this.newData.pet,
        petId: this.newData.petId,
        isApproved: true,
        isClose: true,
      });
    } else {
      const refCol = doc(
        doc(this.firestore, 'pets', this.newData.petId),
        'histories',
        this.newData.id
      );
      await updateDoc(refCol, newData);
      response = {
        ...newData,
        id: this.data.id,
      };
      await updateDoc(doc(this.firestore, 'appointments', this.data.id), {
        assignedName: vet ? vet.fullname : '',
        assignedId: this.newData.vet ?? '',
        date: date,
        userId: this.newData.userId,
        reason: `El estado de ${this.newData.pet}: '${this.newData.status}' `,
        notes: this.newData.reason,
        petName: this.newData.pet,
        petId: this.newData.petId,
        isApproved: true,
        isClose: true,
      });
    }

    this.dialogRef.close(response);

    this.loader.hide();
  }

  deleteImage(item: string, index: number) {
    this.newData.images.splice(index, 1);
    if (item.indexOf('data') >= 0) {
      const position = this.images.findIndex((img) => img === item);
      this.images.splice(position, 1);
    }
  }

  async onInput(event: any) {
    if (event.target.files.length == 0) return;
    for (const element of event.target.files) {
      this.images.push(element);
      const stringb64 = await this.toBase64(element);
      this.newData.images.push(stringb64);
    }
  }

  toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
}
