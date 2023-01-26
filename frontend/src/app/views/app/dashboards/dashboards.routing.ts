import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardsComponent } from './dashboards.component';
import { DefaultComponent } from './default/default.component';
import { UserRole } from 'src/app/shared/auth.roles';
import { AllComponent } from './all/all.component';
import { UsersComponent } from '../users/users.component';
import { SchoolYearsComponent } from '../school-years/school-years.component';
import { SubjectsComponent } from '../subjects/subjects.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardsComponent,
    children: [
      { path: '', redirectTo: 'all', pathMatch: 'full' },
      {
        path: 'default',
        component: DefaultComponent,
        // data: { roles: [UserRole.Admin] },
      },
      {
        path: 'all',
        component: AllComponent,
        // children: [
        //   { path: '', redirectTo: 'all', pathMatch: 'full' },
        //   {
        //     path: 'users',
        //     component: UsersComponent,
        //     data: { roles: [UserRole.Admin] },
        //   },
        //   {
        //     path: 'school-years',
        //     component: SchoolYearsComponent,
        //     data: { roles: [UserRole.Admin] },
        //   },
        //   {
        //     path: 'subjects',
        //     component: SubjectsComponent,
        //     data: { roles: [UserRole.Admin, UserRole.Teacher, UserRole.Student] },
        //   },
        // ],
        // data: { roles: [UserRole.Editor] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsRoutingModule {}
