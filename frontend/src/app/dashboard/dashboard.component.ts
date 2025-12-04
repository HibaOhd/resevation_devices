import { CommonModule, formatDate } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

interface Device {
  id: number;
  name: string;
  serialNumber: string;
  departmentId: number;
  imageUrl: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})


export class DashboardComponent  implements OnInit {

  
  devices: Device[] = [];
  apiUrl: string = 'http://localhost:30081/api/devices';
  isModalOpen: boolean = false;
  newReservation: any = { startDate: '', endDate: '', userId: '', deviceId: '' };

  constructor(private http: HttpClient,private sanitizer: DomSanitizer) {}

  getSafeUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl('http://localhost:30081/uploads/' + imageUrl);
  }

  ngOnInit(): void {
    this.fetchDevices();
    const userid = localStorage.getItem('userid');

    // Log the token to the console
    if (userid) {
      console.log('Retrieved userid:', userid);
    } else {
      console.log('No userid found in localStorage');
    }
  }

  fetchDevices(): void {
    this.http.get<Device[]>(this.apiUrl).subscribe(
      (response) => {
        this.devices = response;
      },
      (error) => {
        console.error('Error fetching devices:', error);
      }
    );
  }
  openModal(deviceId: number): void {
    this.isModalOpen = true;
    this.newReservation.deviceId = deviceId;  // Set deviceId to the model
  }
  
  

  closeModal(): void {
    this.isModalOpen = false;
    this.newReservation.startDate = '';
    this.newReservation.endDate = '';
  }

  addReservation(deviceId: number): void {
    const userid = localStorage.getItem('userid');
    if (!userid) {
      console.error('User not logged in');
      return;
    }
  
    // Get the current date
    const today = new Date();
    
    // Convert start and end date strings to Date objects for comparison
    const startDate = new Date(this.newReservation.startDate);
    const endDate = new Date(this.newReservation.endDate);
  
    // Check if start date is greater than end date
    if (startDate > endDate) {
      alert('Start Date cannot be later than End Date');
      return;
    }
  
    // Check if either start date or end date is in the past
    if (startDate < today || endDate < today) {
      alert('Start Date and End Date must be today or in the future');
      return;
    }
  
    // Format the start and end dates for the API request
    const formattedStartDate = formatDate(this.newReservation.startDate, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');
    const formattedEndDate = formatDate(this.newReservation.endDate, "yyyy-MM-dd'T'HH:mm:ss", 'en-US');
  
    const reservationData = {
      userId: userid,
      deviceId: deviceId,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  
    // Proceed with the API request if validation passed
    this.http.post('http://localhost:30081/api/reservations', reservationData).subscribe(
      (response) => {
        console.log('Reservation added successfully:', response);
        this.closeModal();
      },
      (error) => {
        alert('There is already a reservation for this device during the selected dates.');
        console.error('Error adding reservation:', error);
      }
    );
  }
  
}  
