import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { EditAppComponent } from './edit-app/edit-app.component';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
})
export class AppointmentsComponent {
  loading = false;
  list: any[] = [];
  users: any[] = [];
  search: string = '';
  vets: any[] = [];
  vetId: string = '0';
  clientId: string = '0';
  status: number = 0;
  constructor(private firestore: Firestore, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getList();
  }
  async getUsers() {
    this.loading = true;
    const userRef = collection(this.firestore, 'users');
    const queryUser = query(userRef);
    const vets = await getDocs(queryUser);

    if (vets.empty) {
      this.users = [];
      this.vets = [];
    }
    vets.docs.forEach((item) => {
      const data: any = item.data();
      if (data.isClient) {
        this.users.push({
          id: item.id,
          email: data.email,
          profile: data.profile,
          fullname: data.fullname,
        });
      }

      if (data.isVet) {
        this.vets.push({
          id: item.id,
          fullname: data.fullname,
        });
      }
    });
    this.loading = false;
  }
  async getList() {
    await this.getUsers();
    this.loading = true;
    const userRef = collection(this.firestore, 'appointments');
    const queryUser = query(userRef);
    const appointments = await getDocs(queryUser);

    if (appointments.empty) {
      this.list = [];
    }

    this.list = appointments.docs.map((item) => {
      const data: any = item.data();
      const dateFormat = new Date(data.date);
      const user = this.users.find((x) => x.id == data.userId);
      return {
        id: item.id,
        assignedId: data.assignedId,
        assignedName: data.assignedName,
        isClose: data.isClose,
        isApproved: data.isApproved,
        date: data.date,
        dateFormat: dateFormat,
        notes: data.notes,
        petName: data.petName,
        reason: data.reason,
        user: user,
        userId: data.userId,
      };
    });

    this.loading = false;
  }
  async approved(item: any, index: number) {
    await updateDoc(doc(this.firestore, 'appointments', item.id), {
      isApproved: true,
    });
    this.list[index].isApproved = true;
  }
  async complete(item: any, index: number) {
    await updateDoc(doc(this.firestore, 'appointments', item.id), {
      isClose: true,
    });
    this.list[index].isClose = true;
  }
  async cancel(item: any, index: number) {
    await updateDoc(doc(this.firestore, 'appointments', item.id), {
      isApproved: false,
      isClose: true,
    });
    this.list[index].isApproved = false;
    this.list[index].isClose = true;
  }

  openEditDialog(item: any, index: number) {
    const dialogRef = this.dialog.open(EditAppComponent, {
      data: {
        ...item,
        vets: this.vets,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == null) return;

      console.log(result);
      this.list.splice(index, 1, {
        ...this.list[index],
        assignedId: result.assignedId,
        assignedName: result.assignedName,
        notes: result.notes,
      });
    });
  }
}
