import { NgFor, NgIf } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BackendService } from "../services/backend-service.service";
import { AccessToken } from "../../types/accessToken";

@Component({
    selector: "access-tokens",
    standalone: true,
    imports: [NgFor, NgIf, FormsModule],
    templateUrl: './access-tokens.component.html',
    styleUrl: './access-tokens.component.css'
})
export class AccessTokensComponent {
    constructor(private backendService: BackendService){}
    accessTokens: AccessToken[] = [];

    async updateAccessTokens() {
        ((await this.backendService.getAccessTokens()).subscribe(tokens => {
            this.accessTokens = tokens;
        }))
    }

    async generateAccessToken() {
        ((await this.backendService.createAccessToken(true)).subscribe(_result => {
            this.updateAccessTokens();
        }))
    }
    
    async invalidateToken(id: number) {
        ((await this.backendService.invalidateAccessToken(id)).subscribe(_result => {
            this.updateAccessTokens();
        }))
    }
    async validateToken(id: number) {
        ((await this.backendService.validateAccessToken(id)).subscribe(_result => {
            this.updateAccessTokens();
        }))
    }
    async deleteToken(id: number) {
        ((await this.backendService.deleteAccessToken(id)).subscribe(_result => {
            this.updateAccessTokens();
        }))
    }
}