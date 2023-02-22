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
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent {
  loading = false;
  list: any[] = [];
  search: string = '';
  constructor(
    private firestore: Firestore,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getList();
  }
  async getList() {
    this.loading = true;
    const userRef = collection(this.firestore, 'users');
    const queryUser = query(userRef, where('isClient', '==', true));
    const vets = await getDocs(queryUser);

    if (vets.empty) {
      this.list = [];
    }
    this.list = vets.docs.map((item) => {
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
    const dialogRef = this.dialog.open(CreateCustomerComponent, {
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == null) return;
      const index = this.list.findIndex((item) => item.id == result.id);
      this.list.splice(index, 1, result);
    });
  }
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateCustomerComponent, {
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
        this.list.push(result);
      }
    });
  }
  async deleteItem(item: any, index: number) {
    await deleteDoc(doc(this.firestore, 'users', item.id));

    this.list.splice(index, 1);
  }
  goToPet(item: any) {
    this.router.navigateByUrl(`/pet/${item.id}/list`);
  }
}
