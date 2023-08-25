import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.http.get<any[]>('http://localhost:8889/api/bookings', {withCredentials: true}).subscribe(
      (bookings) => {
        this.bookings = bookings;
      },
      (error) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  cancelBooking(bookingId: string) {
    this.http.delete(`http://localhost:8889/api/bookings/${bookingId}`, {withCredentials: true}).subscribe(
      () => {
        this.fetchBookings(); 
      },
      (error) => {
        console.error('Error cancelling booking:', error);
      }
    );
  }
}
