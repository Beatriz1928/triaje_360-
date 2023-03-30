import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LightboxModule } from 'ngx-lightbox';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddNewProductModalComponent } from './add-new-product-modal/add-new-product-modal.component';
import { ListPageHeaderComponent } from './list-page-header/list-page-header.component';
import { ProfileUserSocialComponent } from './profile-user-social/profile-user-social.component';
import { ProfilePhotosComponent } from './profile-photos/profile-photos.component';
import { ComponentsPagesModule } from '../../components/pages/components.pages.module';
import { ProfileGalleryComponent } from './profile-gallery/profile-gallery.component';
import { ProfileUserPortfolioComponent } from './profile-user-portfolio/profile-user-portfolio.component';
import { ProfileProcessComponent } from './profile-process/profile-process.component';
import { ComponentsCardsModule } from '../../components/cards/components.cards.module';
import { BlogSideVideoComponent } from './blog-side-video/blog-side-video.component';
import { BlogContentComponent } from './blog-content/blog-content.component';
import { FeatureComparisonComponent } from './feature-comparison/feature-comparison.component';
import { ComponentsPlayerModule } from 'src/app/components/player/components.player.module';
import { LayoutContainersModule } from '../layout/layout.containers.module';
// import { ProductDetailInfoAltComponent } from './product-detail-info-alt/product-detail-info-alt.component';
// import { ProductDetailInfoComponent } from './product-detail-info/product-detail-info.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { RatingModule } from 'ngx-bootstrap/rating';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AddNewUserModalComponent } from './add-new-user-modal/add-new-user-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddNewSchoolYearModalComponent } from './add-new-school-year-modal/add-new-school-year-modal.component';
import { AddNewSceneModalComponent } from './add-new-scene-modal/add-new-scene-modal.component';
import { AddNewVictimImageModalComponent } from './add-new-victim-image-modal/add-new-victim-image-modal.component';
import { TratamientoModalComponent } from './tratamiento-modal/tratamiento-modal-component';
import { AddNewVictimModalComponent } from './add-new-victim-modal/add-new-victim-modal.component';
import { AddNewSonidoModalComponent } from './add-new-sonido-modal/add-new-sonido-modal.component';
import { AddNewSubjectModalComponent } from './add-new-subject-modal/add-new-subject-modal.component';
import { AddPatientModalComponent } from './add-patient-modal/add-patient-modal.component';
import { ManageSubjectModalComponent } from './manage-subject-modal/manage-subject-modal.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ShowStudentRegisterModalComponent } from './show-student-register-modal/show-student-register-modal.component';
import { SelectPatientImgModalComponent } from './select-patient-img-modal/select-patient-img-modal.component';
import { LocatePatientComponent } from './locate-patient/locate-patient.component';
import { TriarPatientComponent } from './triar-patient/triar-patient.component';


@NgModule({
  declarations: [
    AddNewProductModalComponent,
    ListPageHeaderComponent,
    ProfileUserSocialComponent,
    ProfilePhotosComponent,
    ProfileGalleryComponent,
    ProfileUserPortfolioComponent,
    ProfileProcessComponent,
    BlogSideVideoComponent,
    BlogContentComponent,
    FeatureComparisonComponent,
    // ProductDetailInfoAltComponent,
    // ProductDetailInfoComponent,
    AddNewUserModalComponent,
    AddNewSchoolYearModalComponent,
    AddNewSubjectModalComponent,
    AddNewSceneModalComponent,
    AddNewVictimModalComponent,
    AddNewVictimImageModalComponent,
    AddPatientModalComponent,
    ManageSubjectModalComponent,
    ShowStudentRegisterModalComponent,
    SelectPatientImgModalComponent,
    LocatePatientComponent,
    TriarPatientComponent,
    TratamientoModalComponent,
    AddNewSonidoModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CollapseModule,
    FormsModule,
    LayoutContainersModule,
    NgSelectModule,
    LightboxModule,
    ComponentsPagesModule,
    ComponentsCardsModule,
    ComponentsPlayerModule,
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    ReactiveFormsModule
  ],
  exports: [
    AddNewProductModalComponent,
    AddNewUserModalComponent,
    AddNewSchoolYearModalComponent,
    AddNewSubjectModalComponent,
    AddNewSceneModalComponent,
    AddNewVictimModalComponent,
    AddNewVictimImageModalComponent,
    AddPatientModalComponent,
    AddNewSonidoModalComponent ,
    ManageSubjectModalComponent,
    ListPageHeaderComponent,
    ProfileUserSocialComponent,
    ProfilePhotosComponent,
    ProfileGalleryComponent,
    ProfileUserPortfolioComponent,
    ProfileProcessComponent,
    BlogSideVideoComponent,
    BlogContentComponent,
    FeatureComparisonComponent,
    // ProductDetailInfoAltComponent,
    // ProductDetailInfoComponent,
    ShowStudentRegisterModalComponent,
    SelectPatientImgModalComponent,
    LocatePatientComponent,
    TriarPatientComponent,
    TratamientoModalComponent,


  ]
})
export class PagesContainersModule { }
