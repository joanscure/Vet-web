import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MaterialModule } from '../material.module';
import { DrawerComponent } from '../components/drawer/drawer.component';
import { VetComponent } from './vet/vet.component';
import { CustomerComponent } from './customer/customer.component';
import { PetComponent } from './pet/pet.component';
import { TypePetComponent } from './type-pet/type-pet.component';
import { UserComponent } from './user/user.component';
import { ChatComponent } from './chat/chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateVetComponent } from './vet/create/create.component';
import { FilterListPipe } from '../pipes/filter-list.pipe';
import { CreateTypeComponent } from './type-pet/create-type/create-type.component';
import { CreateCustomerComponent } from './customer/create-customer/create-customer.component';
import { PetInfoComponent } from './pet-info/pet-info.component';
import { CreatePetComponent } from './pet/create-pet/create-pet.component';
import { CreateEventComponent } from './pet-info/create-event/create-event.component';
import { CreateHistoryComponent } from './pet-info/create-history/create-history.component';

@NgModule({
  declarations: [
    HomeComponent,
    DrawerComponent,
    VetComponent,
    CustomerComponent,
    PetComponent,
    TypePetComponent,
    UserComponent,
    ChatComponent,
    CreateVetComponent,
    FilterListPipe,
    CreateTypeComponent,
    CreateCustomerComponent,
    PetInfoComponent,
    CreatePetComponent,
    CreateEventComponent,
    CreateHistoryComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HomeModule {}
