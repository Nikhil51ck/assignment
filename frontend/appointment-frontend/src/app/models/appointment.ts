export interface Appointment {
    id?: number;
    customerName: string;
    customerEmail: string;
    appointmentDateTime: string;
    description?: string;
    status?: string;
}
