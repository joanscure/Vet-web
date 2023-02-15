import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ChatComponent } from './chat/chat.component';
import { CustomerComponent } from './customer/customer.component';
import { HomeComponent } from './home.component';
import { PetInfoComponent } from './pet-info/pet-info.component';
import { PetComponent } from './pet/pet.component';
import { TypePetComponent } from './type-pet/type-pet.component';
import { UserComponent } from './user/user.component';
import { VetComponent } from './vet/vet.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'vet', component: VetComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'customer', component: CustomerComponent },
      { path: 'user', component: UserComponent },
      { path: 'type-pet', component: TypePetComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'pet/:id/list', component: PetComponent },
      { path: 'pet/:id/info/:pet', component: PetInfoComponent },
      { path: '**', redirectTo: 'vet' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
