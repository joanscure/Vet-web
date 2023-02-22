import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalstorageService } from '../../services/localstorage.services';
import {
  Firestore,
  collectionData,
  collection,
  where,
  query,
  getDocs,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { CreateVetComponent } from './create/create.component';

@Component({
  selector: 'app-vet',
  templateUrl: './vet.component.html',
  styleUrls: ['./vet.component.scss'],
})
export class VetComponent {
  loading = false;
  vetsList: any[] = [];
  search: string = '';
  constructor(
    private _snackBar: MatSnackBar,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getVets();
  }
  async getVets() {
    this.loading = true;
    const userRef = collection(this.firestore, 'users');
    const queryUser = query(userRef, where('isVet', '==', true));
    const vets = await getDocs(queryUser);

    if (vets.empty) {
      this.vetsList = [];
    }

    this.vetsList = vets.docs.map((item) => {
      const data: any = item.data();
      return {
        id: item.id,
        email: data.email,
        profile: data.profile,
        fullname: data.fullname,
      };
    });
    this.loading = false;
  }
  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(CreateVetComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == null) return;
      const index = this.vetsList.findIndex((item) => item.id == result.id);
      this.vetsList.splice(index, 1, result);
    });
  }
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateVetComponent, {
      data: {
        id: '',
        fullname: '',
        email: '',
        profile: {
          phoneNumber: '',
          dni: '',
          whatsapp: '',
          specialist: '',
          notes: '',
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.vetsList.push(result);
      }
    });
  }
  async deleteItem(item: any, index: number) {
    await deleteDoc(doc(this.firestore, 'users', item.id));

    this.vetsList.splice(index, 1);
  }
}
