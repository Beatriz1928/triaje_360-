import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExercisesComponent } from './exercises.component';
import { DataListComponent } from './data-list/data-list.component';
import { ThumbListComponent } from './thumb-list/thumb-list.component';
import { ImageListComponent } from './image-list/image-list.component';
import { ViewExerciseComponent } from './view-exercise/view-exercise.component';
import { DoExerciseComponent } from './do-exercise/do-exercise.component';
import { ViewReportComponent } from './view-report/view-report.component';

const routes: Routes = [
  {
    path: '', component: ExercisesComponent,
    children: [
      { path: '', redirectTo: 'data-list', pathMatch: 'full' },
      { path: 'data-list', component: DataListComponent },
      { path: 'view-exercise', component: ViewExerciseComponent },
      { path: 'view-report', component: ViewReportComponent },
      { path: 'do-exercise', component: DoExerciseComponent },
      { path: 'thumb-list', component: ThumbListComponent },
      { path: 'image-list', component: ImageListComponent },
      { path: 'data-list/:uid', component: DataListComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExercisesRoutingModule { }
