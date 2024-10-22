import { Component } from "@angular/core";
import { Registration } from "../../types/registration";
import { NgFor, NgIf } from "@angular/common";
import { BackendService } from "../services/backend-service.service";
import { RegistrationComponent } from "../registration/registration.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as sentry from '@sentry/angular';

@Component({
    selector: 'registrations',
    standalone: true,
    imports: [NgFor, NgIf, RegistrationComponent, MatProgressSpinnerModule],
    templateUrl: './registrations.component.html',
    styleUrls: ['./registrations.component.css', '../shared.css'],
})
export class RegistrationsComponent {
    constructor(private backendService: BackendService) {}
    registrations : Registration[] = [];
    showErrorMessage = false;
    errorMessage = '';
    showSuccessMessage = false;
    successMessage = '';
    isLoading = false;

    async getRegistrations() {
        this.isLoading = true;
        const userAttributes = await this.backendService.getUserGroup();
        (await this.backendService.getRegistrations()).subscribe({
            next: (result) => {
                console.log(result);
                this.registrations = result;
                this.showErrorMessage = false;
                this.isLoading = false
                this.showSuccessMessage = true
                this.successMessage = 'Successfully fetched the registrations';
            },
            error: (error) => {
                this.showErrorMessage = true;
                this.errorMessage = 'There was an error fetching the registrations, please try again later';
                this.isLoading = false;
                sentry.captureException(error);
            }
        });
    }

    updateSuccessMessage(message: string) {
        this.showErrorMessage = false;
        this.showSuccessMessage = true;
        this.successMessage = message;
    }

    updateErrorMessage(message: string) {
        this.showSuccessMessage = false;
        this.showErrorMessage = true;
        this.errorMessage = message;
    } 
}