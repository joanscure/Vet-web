import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { GenerateUserComponent } from './generate-user/generate-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  loading = false;
  users: any[] = [];
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
    const queryUser = query(userRef);
    const users = await getDocs(queryUser);

    if (users.empty) {
      this.users = [];
    }

    this.users = users.docs.map((item) => {
      const data: any = item.data();
      return {
        id: item.id,
        email: data.email,
        profile: data.profile,
        fullname: data.fullname,
        isCreated: data.isCreated,
      };
    });
    this.loading = false;
  }

  openCreateDialog(item: any, index: number): void {
    const dialogRef = this.dialog.open(GenerateUserComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.users[index].isCreated = result.isCreated;
      }
    });
  }
}
