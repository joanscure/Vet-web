import { Component } from '@angular/core';
import {
  collection,
  Firestore,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { doc, getDoc } from '@firebase/firestore';
import * as moment from 'moment';
import { CreateEventComponent } from './create-event/create-event.component';
import { CreateHistoryComponent } from './create-history/create-history.component';

@Component({
  selector: 'app-pet-info',
  templateUrl: './pet-info.component.html',
  styleUrls: ['./pet-info.component.scss'],
})
export class PetInfoComponent {
  loading = false;
  user_id: any = null;
  pet: any = {};
  list: any[] = [];
  events: any[] = [];
  pet_id: any = null;
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

      this.pet_id = params.pet;
      if (!this.pet_id) {
        this.goBack();
      }
    });
  }

  ngOnInit(): void {
    this.getPet();
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

  async getList() {
    this.loading = true;

    const refCol = collection(
      doc(this.firestore, 'pets', this.pet_id),
      'events'
    );

    const queryUser = query(refCol);

    const events = await getDocs(queryUser);
    if (events.empty) {
      this.events = [];
    }
    this.events = events.docs.map((item: any) => {
      const data: any = item.data();

      const dateFormat = new Date(data.date).toISOString().substring(0, 10);
      return {
        id: item.id,
        reason: data.reason,
        notes: data.notes,
        date: data.date,
        dateFormat: dateFormat,
      };
    });
    const refColHistory = collection(
      doc(this.firestore, 'pets', this.pet_id),
      'histories'
    );

    const queryHistory = query(refColHistory);

    const histories = await getDocs(queryHistory);
    if (histories.empty) {
      this.list = [];
    }
    this.list = histories.docs.map((item: any) => {
      const data: any = item.data();

      const dateFormat = new Date(data.date).toISOString().substring(0, 10);
      return {
        id: item.id,
        reason: data.reason,
        anamnesis: data.anamnesis,
        date: data.date,
        diagnostic: data.diagnostic,
        treatment: data.treatment,
        images: data.images,
        dateFormat: dateFormat,
      };
    });

    this.loading = false;
  }

  async getPet() {
    this.loading = true;
    await this.getList();
    const docRef = doc(this.firestore, 'pets', this.pet_id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      const age = this.displayAge(
        moment(new Date(data['birthdate'])),
        moment()
      );
      this.pet = { ...data, age };
    } else {
      this.goBack();
    }
    this.loading = false;
  }

  goBack = () => {
    this.router.navigate(['/customer']);
  };

  openCreateEvent(): void {
    const dialogRef = this.dialog.open(CreateEventComponent, {
      data: {
        id: '',
        reason: '',
        notes: '',
        date: '',
        petId: this.pet_id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        const dateFormat = new Date(result.date).toISOString().substring(0, 10);
        this.events.push({ ...result, dateFormat });
      }
    });
  }
  openCreateHistory(): void {
    const dialogRef = this.dialog.open(CreateHistoryComponent, {
      data: {
        id: '',
        reason: '',
        anamnesis: '',
        date: '',
        diagnostic: '',
        treatment: '',
        images: [],
        petId: this.pet_id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        const dateFormat = new Date(result.date).toISOString().substring(0, 10);
        this.list.push({ ...result, dateFormat });
      }
    });
  }
}
