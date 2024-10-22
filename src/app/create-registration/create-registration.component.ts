import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CreateRegistration } from "./create-registration";
import { BackendService } from "../services/backend-service.service";
import { NgIf } from "@angular/common";
import * as sentry from '@sentry/angular';
import { environment } from "../../environments/environment";

@Component({
    selector: 'create-registration',
    standalone: true,
    imports: [FormsModule, NgIf],
    templateUrl: './create-registration.component.html',
    styleUrls: ['./create-registration.component.css', '../shared.css'],
})
export class CreateRegistrationComponent {
    showErrorMessage = false;
    errorMessage = '';
    showSuccessMessage = false;
    successMessage = '';
    constructor(private backendService: BackendService) {}
    @Input() createRegistration: CreateRegistration = {
        shipId: ''
    };

    async createAuthenticationRegistration() {
        (await this.backendService.createRegistrationRequest(this.createRegistration)).subscribe({
            next: (_result) => {
                this.showErrorMessage = false;
                this.errorMessage = ''
                this.showSuccessMessage = true
                this.successMessage = 'Successfully created the authentication request';
            },
            error: (error) => {
                this.showErrorMessage = true;
                this.showSuccessMessage = false;
                this.errorMessage = 'There was an error creating the registration request, please try again later'
                const id = sentry.captureException(error);
                console.error('Error capturing error', error);
            }
        })
    }

    downloadFile(content: string, name: string) {
        const newBlob = new Blob([content], { type: "text/csv" });
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement("a");
        link.href = data;
        link.download = name; // set a name for the file
        link.click();
    }

    async pollAuthenticationRegistration() {
        ((await this.backendService.getRegistrationStatus(this.createRegistration.shipId)).subscribe({
            next: (result) => {
                this.showErrorMessage = false;
                this.errorMessage = ''
                if (result.certificate) {
                    this.downloadFile(result.certificate, `${result.shipInformation?.clientName}-${result.shipInformation?.shipName}-certificate.crt`)
                }
                if (result.PrivateKey) {
                    this.downloadFile(result.PrivateKey, `${result.shipInformation?.clientName}-${result.shipInformation?.shipName}-key.key`)
                }
            },
            error: (error) => {
                this.showErrorMessage = true;
                this.showSuccessMessage = false;
                this.errorMessage = 'There was an error fetching the registration status, please try again later';
                sentry.captureException(error);
            }
        }));
    }
}