import { Component } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { deleteDoc, doc, getDocs, query, where } from '@firebase/firestore';
import { CreateTypeComponent } from './create-type/create-type.component';

@Component({
  selector: 'app-type-pet',
  templateUrl: './type-pet.component.html',
  styleUrls: ['./type-pet.component.scss'],
})
export class TypePetComponent {
  loading = false;
  list: any[] = [];
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
    const userRef = collection(this.firestore, 'typeAnimal');
    const queryUser = query(userRef);
    const vets = await getDocs(queryUser);

    if (vets.empty) {
      this.list = [];
    }
    this.list = vets.docs.map((item) => {
      const data: any = item.data();
      return {
        id: item.id,
        name: data.name,
      };
    });
    this.loading = false;
  }
  openEditDialog(item: any): void {
    const dialogRef = this.dialog.open(CreateTypeComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == null) return;
      const index = this.list.findIndex((item) => item.id == result.id);
      this.list.splice(index, 1, result);
    });
  }
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateTypeComponent, {
      data: {
        id: '',
        name: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result != null) {
        this.list.push(result);
      }
    });
  }
  async deleteItem(item: any, index: number) {
    await deleteDoc(doc(this.firestore, 'typeAnimal', item.id));

    this.list.splice(index, 1);
  }
}
