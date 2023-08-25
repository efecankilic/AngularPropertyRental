import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Property {
  _id: string;
  title: string;
  dailyRate: number;
  image: string;
  summary: string;
  city: string, 
  country: string
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  properties: Property[] = [];
  loading = true;
  searchTerm = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchProperties();
  }

  fetchProperties() {
    this.http.get<Property[]>('http://localhost:8889/api/properties').subscribe(
      (data) => {
        this.properties = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    );
  }

  get filteredProperties(): Property[] {
    return this.properties.filter((property) =>
      property.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onImageError(property: Property) {
    console.error(`Error loading image for property: ${property.title}`);
  }

  viewDetails(propertyId: string) {
    this.router.navigate(['/details', propertyId]);
  }
}
