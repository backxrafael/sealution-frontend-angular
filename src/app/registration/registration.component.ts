import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Registration } from "./registration";
import { BackendService } from "../services/backend-service.service";
import { NgFor, NgIf } from "@angular/common";
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'registration',
    standalone: true,
    imports: [NgFor, NgIf, FormsModule],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.css',
})
export class RegistrationComponent {
    @Input() registration! : Registration;
    @Output() updateRegistrationsEvent = new EventEmitter<boolean>();
    title = 'registration-component';
    constructor(private BackendService: BackendService, private backendService: BackendService){}

    async createDatabase(name: string, bucketName: string, userName: string) {
        (await this.backendService.createInfluxDBOrganization(name,bucketName, userName)).subscribe(result => {
            //TODO: Show errors etc if result is false or status code != 200
            console.log(result);
        })
    }

    async acceptRegistration(registration: Registration) {
        // Accept the registration and update the registrations by fetching the list 
        // of registrations again
        (await this.BackendService.acceptRegistration(registration)).subscribe(_result => {
            this.updateRegistrationsEvent.emit(true);
        })
        await this.createDatabase(registration.clientName, `${registration.clientName}-bucket`, registration.shipName)
    }

    async denyRegistration(registration: Registration) {
        // Deny the registration and update the registrations by fetching the list 
        // of registrations again
        (await this.BackendService.denyRegistration(registration)).subscribe(_result => {
            this.updateRegistrationsEvent.emit(true);
        })
    }

    async resetRegistration(registration: Registration) {
        // Reset the registration of a registration
        // i.e delete the linked certificate
        (await this.BackendService.resetRegistration(registration)).subscribe(_result => {
            this.updateRegistrationsEvent.emit(true);
        })
    }

    async revokeCertificate(registration: Registration) {
        // Revoke the certificate of a registration
        // i.e set certificate status to inactive
        ((await this.backendService.revokeCertificate(registration)).subscribe(_result => {
            this.updateRegistrationsEvent.emit(true);
        }))
    }
}