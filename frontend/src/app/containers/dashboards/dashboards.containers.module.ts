import { NgModule, Injectable } from '@angular/core';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ConversionRatesChartCardComponent } from './conversion-rates-chart-card/conversion-rates-chart-card.component';
import { IconCardsCarouselComponent } from './icon-cards-carousel/icon-cards-carousel.component';

import { OrderStockRadarChartComponent } from './order-stock-radar-chart/order-stock-radar-chart.component';
import { ProductCategoriesDoughnutComponent } from './product-categories-doughnut/product-categories-doughnut.component';
import { ProductCategoriesPolarAreaComponent } from './product-categories-polar-area/product-categories-polar-area.component';
import { QuickPostComponent } from './quick-post/quick-post.component';
import { SalesChartCardComponent } from './sales-chart-card/sales-chart-card.component';
import { SmallLineChartsComponent } from './small-line-charts/small-line-charts.component';
import { WebsiteVisitsChartCardComponent } from './website-visits-chart-card/website-visits-chart-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsCarouselModule } from 'src/app/components/carousel/components.carousel.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { ComponentsCardsModule } from 'src/app/components/cards/components.cards.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SortablejsModule } from 'ngx-sortablejs';
import { FormsModule  } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RatingModule } from 'ngx-bootstrap/rating';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { IconDashboardsCarouselComponent } from './icon-dashboards-carousel/icon-dashboards-carousel.component';
import { CardSchoolYearsComponent } from './card-school-years/card-school-years.component';
import { CardSubjectsComponent } from './card-subjects/card-subjects.component';
import { CardUsersComponent } from './card-users/card-users.component';
import { CardExercisesComponent } from './card-exercises/card-exercises.component'; // a plugin

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin
]);

@NgModule({
    declarations: [
        AdvancedSearchComponent,
        CalendarComponent,
        ConversionRatesChartCardComponent,
        IconCardsCarouselComponent,
        OrderStockRadarChartComponent,
        ProductCategoriesDoughnutComponent,
        ProductCategoriesPolarAreaComponent,
        QuickPostComponent,
        SalesChartCardComponent,
        SmallLineChartsComponent,
        WebsiteVisitsChartCardComponent,
        IconDashboardsCarouselComponent,
        CardSchoolYearsComponent,
        CardSubjectsComponent,
        CardUsersComponent,
        CardExercisesComponent,

    ],
    imports: [
        SharedModule,
        ComponentsCarouselModule,
        ComponentsChartModule,
        FullCalendarModule,
        NgxDatatableModule,
        SortablejsModule,
        RatingModule.forRoot(),
        FormsModule,
        NgSelectModule,
        ProgressbarModule.forRoot(),
        ModalModule.forRoot(),
        BsDropdownModule.forRoot()
    ],
    providers: [ ],
    exports: [
        AdvancedSearchComponent,
        CalendarComponent,
        ConversionRatesChartCardComponent,
        IconCardsCarouselComponent,
        OrderStockRadarChartComponent,
        ProductCategoriesDoughnutComponent,
        ProductCategoriesPolarAreaComponent,
        QuickPostComponent,
        SalesChartCardComponent,
        SmallLineChartsComponent,
        WebsiteVisitsChartCardComponent,
        IconDashboardsCarouselComponent,
    ]
})

export class DashboardsContainersModule { }
