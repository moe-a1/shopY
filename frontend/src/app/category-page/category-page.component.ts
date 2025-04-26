import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css'],
  imports: [CommonModule, NavComponent, FooterComponent],
})
export class CategoryPageComponent implements OnInit {
  categoryName: string = '';
  products: {image: string; category: string }[] = [
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV5qvulWr8F3-leJlqb5EEQjp1iGlGpT3V8Q&s',
      category: 'Clothes',
    },
    {
      image: 'https://via.placeholder.com/300',
      category: 'Shoes',
    },
    {
      image: 'https://via.placeholder.com/300',
      category: 'Perfumes',
    },
    {
      image: 'https://via.placeholder.com/300',
      category: 'Clothes',
    },
  ];
  filteredProducts: { image: string; category: string }[] = []; 

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.categoryName = this.route.snapshot.paramMap.get('name') || '';
    this.filteredProducts = this.products.filter(
      (product) => product.category.toLowerCase() === this.categoryName.toLowerCase()
    );
  }
}