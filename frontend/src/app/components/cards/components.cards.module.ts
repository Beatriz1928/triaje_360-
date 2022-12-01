import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { GradientCardComponent } from './gradient-card/gradient-card.component';
import { GradientWithRadialProgressCardComponent } from './gradient-with-radial-progress-card/gradient-with-radial-progress-card.component';
import { RadialProcessCardComponent } from './radial-process-card/radial-process-card.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    GradientWithRadialProgressCardComponent,
    RadialProcessCardComponent
  ],
  imports: [
    CommonModule,
    RoundProgressModule,
    SharedModule
  ],
  providers: [],
  exports: [
    GradientWithRadialProgressCardComponent,
    RadialProcessCardComponent
  ]
})

export class ComponentsCardsModule { }
