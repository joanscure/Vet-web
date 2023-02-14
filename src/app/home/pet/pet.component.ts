import { Component } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  where,
  query,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatePetComponent } from './create-pet/create-pet.component';

import * as moment from 'moment';

@Component({
  selector: 'app-pet',
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.scss'],
})
export class PetComponent {
  loading = false;
  list: any[] = [];
  types: any[] = [];
  search: string = '';
  user_id: any = '';
  user: any = null;
  constructor(
    private firestore: Firestore,
    public dialog: MatDialog,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
    this.activateRoute.params.subscribe((params: any) => {
      this.user_id = params.id;
      if (!this.user_id) {
        this.goBack();
      }
    });
  }

  ngOnInit(): void {
    this.getList();
    this.getType();
  }

  goBack = () => {
    this.router.navigate(['/customer']);
  };
  async getList() {
    this.loading = true;
    await this.getUser();

    const petRef = collection(this.firestore, 'pets');
    const queryUser = query(petRef, where('userId', '==', this.user_id));
    const vets = await getDocs(queryUser);

    if (vets.empty) {
      this.list = [];
    }
    this.list = vets.docs.map((item) => {
      const data: any = item.data();
      const age = this.displayAge(moment(new Date(data.birthdate)), moment());
      return {
        id: item.id,
        birthdate: data.birthdate,
        age: age,
        breed: data.breed,
        gender: data.gender,
        name: data.name,
        petType: data.petType,
        photoUrl: '',
        userId: data.userId,
      };
    });
    this.loading = false;
  }
  displayAge(birth: any, target: any) {
    let months = target.diff(birth, 'months', true);
    let birthSpan = {
      year: Math.floor(months / 12),
      month: Math.floor(months) % 12,
      day: Math.round((months % 1) * target.daysInMonth()),
    };
    // you can adjust below logic as your requirements by yourself
    if (birthSpan.year < 1 && birthSpan.month < 1) {
      return birthSpan.day + ' dia' + (birthSpan.day > 1 ? 's' : '');
    } else if (birthSpan.year < 1) {
      return (
        birthSpan.month +
        ' mes' +
        (birthSpan.month > 1 ? 's ' : ' ') +
        birthSpan.day +
        ' dia' +
        (birthSpan.day > 1 ? 's' : '')
      );
    } else if (birthSpan.year < 2) {
      return (
        birthSpan.year +
        ' año' +
        (birthSpan.year > 1 ? 's ' : ' ') +
        birthSpan.month +
        ' mes' +
        (birthSpan.month > 1 ? 's ' : '')
      );
    } else {
      return birthSpan.year + ' año' + (birthSpan.year > 1 ? 's' : '');
    }
  }

  async getType() {
    const docRef = collection(this.firestore, 'typeAnimal');
    const queryUser = query(docRef);
    const vets = await getDocs(queryUser);

    if (vets.empty) {
      this.types = [];
    }
    this.types = vets.docs.map((item) => {
      const data: any = item.data();
      return {
        id: item.id,
        name: data.name,
      };
    });
  }
  async getUser() {
    const docRef = doc(this.firestore, 'users', this.user_id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.user = docSnap.data();
    } else {
      this.goBack();
    }
  }
  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(CreatePetComponent, {
      data: {
        pet: item,
        types: this.types,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == null) return;

      const age = this.displayAge(moment(new Date(result.birthdate)), moment());
      const index = this.list.findIndex((item) => item.id == result.id);
      this.list.splice(index, 1, { ...result, age });
    });
  }
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreatePetComponent, {
      data: {
        pet: {
          id: '',
          birthdate: '',
          breed: '',
          gender: '',
          name: '',
          petType: '',
          photoUrl: '',
          userId: this.user_id,
        },
        types: this.types,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        const age = this.displayAge(
          moment(new Date(result.birthdate)),
          moment()
        );
        this.list.push({ ...result, age });
      }
    });
  }
  async deleteItem(item: any, index: number) {
    await deleteDoc(doc(this.firestore, 'pets', item.id));

    this.list.splice(index, 1);
  }
  goToPetInfo(item: any) {
    this.router.navigateByUrl(`/pet/${this.user_id}/info/${item.id}`);
  }
}
