import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { SenderService } from 'src/app/data/sender.service';
import { ImagenPacienteService } from 'src/app/data/imagenPaciente.service';
import { ImagenPaciente } from 'src/app/models/imagenPaciente.model';
import { PacienteService } from 'src/app/data/paciente.service';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { environment } from 'src/environments/environment';
import { Paciente } from '../../../models/paciente.model';

@Component({
  selector: 'app-add-patient-modal',
  templateUrl: './add-patient-modal.component.html',
  styleUrls: ['./add-patient-modal.component.scss']
})
export class AddPatientModalComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  userRole: number;
  ejercicio: number;
  pacientes: Paciente[] =[];
  idAnyadidos: Paciente[] =[];
  @Input() parentImg: string;
  imagenSeleccionada: string;
  urlPrefixPacientes: string = environment.prefix_urlPacientes;

  @Output() seleccionarVictimas = new EventEmitter<Paciente[]>();
  @Output() resetParentImg = new EventEmitter();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(
    private modalService: BsModalService,
    private auth: AuthService,
    private sender: SenderService,
    private notifications: NotificationsService,
    private pacienteService: PacienteService) { }


  ngOnInit(): void {
    this.userRole = this.auth.rol;
    this.ejercicio = this.sender.idExercise;
    this.getPacientes();
  }

  getPacientes(): void {
    this.pacienteService.getPatients().subscribe(
      data => {
        if (data['ok']) {
          this.pacientes = data['pacientes'];
        }
      },
      error => {
        this.notifications.create('Error', 'No se han podido obtener las victimas', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  incluye(id){

    for(let i = 0; i< this.idAnyadidos.length ; i++){
      if(this.idAnyadidos[i].uid == id){
        return true;
      }
    }
    return false;
  }

  selectpacientes(paciente) {
    // si esta el paciente en el array de id se elimina y si no se anyade
    if(this.idAnyadidos.length == 0 || !this.incluye(paciente.uid)) {
      var element = document.getElementById(paciente.uid);
      element.parentElement.className = 'selected';
      this.idAnyadidos.push(paciente);
    }else{
      this.idAnyadidos.splice(this.idAnyadidos.indexOf(paciente.uid),1);
      var unSelect = document.getElementById(paciente.uid);
      unSelect.parentElement.className = 'noSelected';
    }
  }

  show() {
    // if(this.parentImg) {
      this.imagenSeleccionada = this.parentImg;
      this.resetParentImg.emit();
    // }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  closeModal(): void {
    this.seleccionarVictimas.emit(this.idAnyadidos);
    this.modalRef.hide();
  }

}
