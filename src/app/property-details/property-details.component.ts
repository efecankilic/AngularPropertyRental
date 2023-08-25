import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


interface Property {
  _id: string;
  title: string;
  dailyRate: number;
  image: string;
  city: string;
  country: string;
  description: string;
  summary: string;
  rating: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  maxGuests: number;
  host: string;
  hostImage: string;
}


@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit {
  property: Property | undefined;
  loading = true;
  bookingForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const propertyId = params['id'];
      this.fetchPropertyDetails(propertyId);
    });
  }

  fetchPropertyDetails(propertyId: string): void {
    this.http.get<Property>('http://localhost:8889/api/properties/' + propertyId, {withCredentials: true}).subscribe(
      (data) => {
        this.property = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    );
  }

  onImageError() {
    console.error(`Error loading image for property: ${this.property?.title}`);
  }

  bookProperty() {
    if (this.bookingForm.invalid) {
      return;
    }
  
    const { startDate, endDate } = this.bookingForm.value;
    const bookingData = {
      propertyId: this.property?._id,
      startDate,
      endDate
    };
  
    this.http.post('http://localhost:8889/api/bookings', bookingData, {withCredentials: true}).subscribe(
      () => {
        this.snackBar.open('Property booked successfully!', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      },
      (error) => {
        let errorMessage = 'Error booking property. Please try again later.';
        if (error && error.error && error.error.message) {
          errorMessage = error.error.message; // Extract error message from the error object
        }
  
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        console.error('Error booking property:', error);
      }
    );
  }
  
}