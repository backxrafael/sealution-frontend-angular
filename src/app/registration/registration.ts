export interface Registration {
    id: number;
    shipId: string;
    certificateARN: string;
    status: string;
    // added by the frontend
    shipName: string;
    clientName: string;
}