import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Registration } from "../../types/registration";
import { BackendService } from "../services/backend-service.service";
import { NgFor, NgIf } from "@angular/common";
import { FormsModule } from '@angular/forms';
import * as sentry from '@sentry/angular';

@Component({
    selector: 'registration',
    standalone: true,
    imports: [NgFor, NgIf, FormsModule],
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css', '../shared.css']
})
export class RegistrationComponent {
    @Input() registration! : Registration;
    @Output() updateRegistrationsEvent = new EventEmitter<boolean>();
    @Output() updateErrorMessageEvent = new EventEmitter<string>();
    @Output() updateSuccessMessageEvent = new EventEmitter<string>();
    title = 'registration-component';
    showErrorMessage = false;
    errorMessage = '';
    showSuccessMessage = false;
    successMessage = '';
    constructor(private backendService: BackendService){}

    async createDatabase(name: string, bucketName: string, userName: string) {
        (await this.backendService.createInfluxDBOrganization(name, bucketName, userName)).subscribe({
            next: (result) => {
                this.updateSuccessMessageEvent.emit('Successfully created the influx organization');
            },
            error: (error) => {
                this.showErrorMessage = true;
                this.errorMessage = 'There was an error creating the database, try again later';
                this.updateErrorMessageEvent.emit('There was an error creating the database, try again later');
                sentry.captureException(error);
            }
        })
    }

    async acceptRegistration(registration: Registration) {
        // Accept the registration and update the registrations by fetching the list 
        // of registrations again
        (await this.backendService.acceptRegistration(registration)).subscribe({
            next: (result) => {
                this.updateRegistrationsEvent.emit(true);
                this.updateSuccessMessageEvent.emit('Successfully denied the authentication request');
            },
            error: (error) => {
                this.updateErrorMessageEvent.emit('There was an error accepting the registration, try again later');
                sentry.captureException(error);
            }
        });
        await this.createDatabase(registration.clientName, `${registration.clientName}-bucket`, registration.shipName)
        }
        
        async denyRegistration(registration: Registration) {
            // Deny the registration and update the registrations by fetching the list 
            // of registrations again
            (await this.backendService.denyRegistration(registration)).subscribe({
                next: (result) => {
                    this.updateRegistrationsEvent.emit(true);
                    this.updateSuccessMessageEvent.emit('Successfully denied the authentication request');
                },
                error: (error) => {
                    this.updateErrorMessageEvent.emit('There was an error denying the registration, please try again later');
                    sentry.captureException(error);
                }
        });
    }

    async resetRegistration(registration: Registration) {
        // Reset the registration of a registration
        // i.e delete the linked certificate
        (await this.backendService.resetRegistration(registration)).subscribe({
            next: (result) => {
                this.updateRegistrationsEvent.emit(true);
                this.updateSuccessMessageEvent.emit('Successfully resetted the registration');
            },
            error: (error) => {
                this.updateErrorMessageEvent.emit('There was an error resetting the registration, please try again later');
                sentry.captureException(error);
            }
        });
    }

    async revokeCertificate(registration: Registration) {
        // Revoke the certificate of a registration
        // i.e set certificate status to inactive
        (await this.backendService.revokeCertificate(registration)).subscribe({
            next: (result) => {
                this.updateRegistrationsEvent.emit(true);
                this.updateSuccessMessageEvent.emit('Successfully revoked the certificate');
            },
            error: (error) => {
                this.updateErrorMessageEvent.emit('There was an error revoking the registration, please try again later');
                sentry.captureException(error);
            }
        });
    }
}