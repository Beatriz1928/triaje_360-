import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { DataListComponent } from './data-list/data-list.component';
import { ThumbListComponent } from './thumb-list/thumb-list.component';
import { ImageListComponent } from './image-list/image-list.component';
import { UserRole } from '../../../shared/auth.roles';

const routes: Routes = [
  {
    path: '', component: UsersComponent,
    children: [
      { path: '', redirectTo: 'data-list', pathMatch: 'full' },
      { path: 'data-list', component: DataListComponent },
      { path: 'thumb-list', component: ThumbListComponent },
      { path: 'image-list', component: ImageListComponent },
    ],
    data: { roles: [UserRole.Admin]}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
