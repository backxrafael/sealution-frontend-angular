import { NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BackendService } from "../services/backend-service.service";
import { AccessToken } from "../../types/accessToken";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as sentry from '@sentry/angular';

@Component({
    selector: "access-tokens",
    standalone: true,
    imports: [NgFor, NgIf, FormsModule, MatProgressSpinnerModule],
    templateUrl: './access-tokens.component.html',
    styleUrls: ['./access-tokens.component.css', '../shared.css']
})
export class AccessTokensComponent {
    showErrorMessage = false;
    errorMessage = '';
    showSuccessMessage = false;
    successMessage = '';
    constructor(private backendService: BackendService){}
    accessTokens: AccessToken[] = [];
    isLoading = false;

    async updateAccessTokens() {
        this.isLoading = true;
        ((await this.backendService.getAccessTokens()).subscribe({
            next: (result) => {
                this.accessTokens = result
                this.showErrorMessage = false;
                this.showSuccessMessage = true
                this.errorMessage = 'Successfully fetched the access token, ';
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                this.showErrorMessage = true;
                this.showSuccessMessage = false;
                this.errorMessage = 'There was an error updating the access token, please try again later';
                sentry.captureException(error);
            }
        }));
    }

    async generateAccessToken() {
        ((await this.backendService.createAccessToken(true)).subscribe({
            next: (_result) => {
                this.updateAccessTokens();
                this.showSuccessMessage = true
                this.errorMessage = 'Successfully generated an access token, ';
            },
            error: (error) => {
                this.showErrorMessage = true;
                this.showSuccessMessage = false;
                this.errorMessage = 'There was an error creating the access token, please try again later';
                sentry.captureException(error);
            }
        }));
    }
    
    async invalidateToken(id: number) {
        ((await this.backendService.invalidateAccessToken(id)).subscribe({
            next: (_result) => {
                this.updateAccessTokens();
                this.showSuccessMessage = true
                this.successMessage = 'Successfully invalidated the access token, ';
            },
            error: (error) => {
                this.showErrorMessage = true;
                this.showSuccessMessage = false;
                this.errorMessage = 'There was an error invalidating the access token, please try again later';
                sentry.captureException(error);
            }
        }));
    }
    async validateToken(id: number) {
        ((await this.backendService.validateAccessToken(id)).subscribe({
            next: (_result) => {
                this.updateAccessTokens();
                this.showSuccessMessage = true
                this.successMessage = 'Successfully validated the access token, ';
            },
            error: (error) => {
                this.showErrorMessage = true;
                this.showSuccessMessage = false;
                this.errorMessage = 'There was an error validating the access token, please try again later';
                sentry.captureException(error);
            }
        }));
    }
    async deleteToken(id: number) {
        ((await this.backendService.deleteAccessToken(id)).subscribe({
            next: (_result) => {
                this.updateAccessTokens();
                this.showSuccessMessage = true
                this.successMessage = 'Successfully deleted the access token, ';
            },
            error: (error) => {
                this.showErrorMessage = true;
                this.showSuccessMessage = false;
                this.errorMessage = 'There was an error deleting the access token, please try again later';
                sentry.captureException(error);
            }
        }));
    }
}