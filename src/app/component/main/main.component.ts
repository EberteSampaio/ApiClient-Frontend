import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Client } from '../../model/Client';
import { ClientService } from '../../service/client.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Utils } from '../../helpers/Utils';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';


@Component({
  selector: 'app-main',
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  btnRegistration: boolean = true;
  btnCancel: boolean = false;
  btnAlter: boolean = false;
  btnRemove: boolean = false;
  table: boolean = true;
  ids: number[] = [];
  client = new Client();

  clients: Client[] = [];

  constructor(private service: ClientService) { }

  all(): void {
    this.service.findAll()
      .subscribe(response => this.clients = response);
  }

  create(myForm: NgForm): void {
    try {
      if (!myForm.valid){
        throw new Error("Formulário Inválido");
      }

      Utils.validateCNPJ(this.client.identificationNumber);
      this.service.save(this.client)
        .subscribe(response => {
          this.clients.push(response)
          this.client = new Client();
        });

        myForm.resetForm();

      alert('Empresa Cadastrada com sucesso!')

    } catch (e) {
      if (e instanceof Error) alert(e.message);
    }
  }

  selectClient(rowPosition: number): void {
    this.client = this.clients[rowPosition];

    this.btnRegistration = false;
    this.btnAlter = true;
    this.btnCancel = true;
    this.table = false;
  }

  alterClient(myForm:NgForm): void {
    try {

      if (!myForm.valid){
        throw new Error("Formulário Inválido");
      }

      Utils.validateCNPJ(this.client.identificationNumber);
      this.service.edit(this.client)
        .subscribe(response => {
          let position = this.clients.findIndex(object => {
            return object.id == response.id;
          });

          this.clients[position] = response;
        });

      this.client = new Client();
      this.btnRegistration = true;
      this.table = true;

      this.btnCancel = false;
      this.btnAlter = false;
      this.btnRemove = false;

      myForm.resetForm();

      alert("Empresa editado com sucesso!");
    } catch (e) {
      if (e instanceof Error) alert(e.message);
    }
  }

  remove(): void {
    this.service.delete(this.ids).subscribe(() => {

      this.clients = this.clients.filter(client => !this.ids.includes(client.id));

      this.client = new Client();
      this.btnRegistration = true;
      this.table = true;
      this.btnAlter = false;
      this.btnRemove = false;
      this.btnCancel = false;
  
      alert("Empresas excluídas com sucesso!");
    }, error => {
      alert("Ocorreu um erro ao excluir as empresas!");
    });
  }  
  
  public addArray(id: number): void {

    if (this.ids.includes(id)) {
      this.ids = this.ids.filter(item => item !== id);

      if (this.ids.length == 0) {
        this.btnRemove = false;
      }

      return;
    }

    this.ids.push(id);
    this.btnRemove = true;
  }

  ngOnInit() {
    this.all()
  }
}
