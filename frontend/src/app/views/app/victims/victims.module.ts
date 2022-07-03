import { NgModule } from '@angular/core';
 import { SharedModule } from '../../../shared/shared.module';
// import { ThumbListComponent } from './thumb-list/thumb-list.component';
// import { ImageListComponent } from './image-list/image-list.component';
// import { DetailsComponent } from './details/details.component';
import { DataListComponent } from './data-list/data-list.component';
import { VictimsRoutingModule } from './victims.routing';
import { VictimsComponent } from './victims.component';
// import { DetailsAltComponent } from './details-alt/details-alt.component';
import { ComponentsCarouselModule } from '../../../components/carousel/components.carousel.module';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module';
import { HotkeyModule } from 'angular2-hotkeys';
import { ComponentsCardsModule } from '../../../components/cards/components.cards.module';
import { ComponentsChartModule } from '../../../components/charts/components.charts.module';
import { FormsModule as FormsModuleAngular, ReactiveFormsModule } from '@angular/forms';
import { LayoutContainersModule } from '../../../containers/layout/layout.containers.module';
import { ContextMenuModule } from 'ngx-contextmenu';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { RatingModule } from 'ngx-bootstrap/rating';
// import { AddExerciseComponent } from './add-exercise/add-exercise.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { WizardsContainersModule } from '../../../containers/wizard/wizards.containers.module';

@NgModule({
  declarations: [DataListComponent,  VictimsComponent],
 // declarations: [DataListComponent, DetailsComponent, ImageListComponent, ThumbListComponent, DetailsAltComponent, AddExerciseComponent],
  imports: [
    SharedModule,
    VictimsRoutingModule,
    ComponentsCarouselModule,
    LayoutContainersModule,
    WizardsContainersModule,
    PagesContainersModule,
    ComponentsCardsModule,
    ComponentsChartModule,
    RatingModule.forRoot(),
    FormsModuleAngular,
    ReactiveFormsModule,
    HotkeyModule.forRoot(),
    PaginationModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    NgSelectModule
  ]
})
export class VictimsModule { }
