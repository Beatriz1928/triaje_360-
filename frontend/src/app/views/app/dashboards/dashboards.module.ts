import { NgModule } from '@angular/core';
import { DefaultComponent } from './default/default.component';
import { DashboardsComponent } from './dashboards.component';
import { DashboardsRoutingModule } from './dashboards.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';
import { ComponentsCardsModule } from 'src/app/components/cards/components.cards.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { AllComponent } from './all/all.component';

@NgModule({
  declarations: [ DefaultComponent,DashboardsComponent, AllComponent],
  imports: [
    SharedModule,
    LayoutContainersModule,
    DashboardsRoutingModule,
    ComponentsCardsModule
  ]
})
export class DashboardsModule { }
