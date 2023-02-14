import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Firestore,
  collectionData,
  collection,
  where,
  query,
  getDocs,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LocalstorageService } from '../services/localstorage.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(
    private _snackBar: MatSnackBar,
    public auth: AngularFireAuth,
    private firestore: Firestore,
    private router: Router,
    private lStorage: LocalstorageService
  ) {}

  ngOnInit(): void {
    if (this.lStorage.get('USER')) {
      this.router.navigateByUrl('');
    }
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Ingrese un valor';
    }

    return this.email.hasError('email') ? 'El email no es valido' : '';
  }
  login() {
    this.auth
      .signInWithEmailAndPassword(
        this.email.value ?? '',
        this.password.value ?? ''
      )
      .then(async (response) => {
        //const user = response.user;
        const userRef = collection(this.firestore, 'users');
        const queryUser = query(
          userRef,
          where('email', '==', this.email.value ?? ''),
          where('isAdmin', '==', true)
        );
        const user = await getDocs(queryUser);

        if (user.empty) {
          this._snackBar.open('Usted no esta permitido');
        }
        this.lStorage.set('USER', {
          ...user?.docs[0].data(),
          id: user.docs[0].id,
        });

        this.router.navigateByUrl('/vet');
      })
      .catch((err) => {
        console.log(err);
        this._snackBar.open(err.message);
      });
  }
}
