import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DescriptionComponent } from '~/modules/resources/description/description.component';
import { CategoryComponent } from '~/modules/resources/category/category.component';

import { DataService } from '../../services/data.service';

import { Resources } from '../../interfaces/resources.interface';
import { Category } from '~/interfaces/category.interface';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DescriptionComponent,
    CategoryComponent,
    RouterModule
  ],
  templateUrl: './container.component.html',
  styles: [`.mirror {transform: scaleX(-1);}`],
})

export class ContainerComponent implements OnInit {

  state: number = 0;
  isMobile: boolean = false;
  category: Category[] = [];
  categories: { category: string, subcategories: string[] }[] = [];
  isCategorySelected: boolean = false;

  subcategoryNames: { [key: string]: string } = {};

  
  data: Resources[] = [];
  filteredData: { [subcategory: string]: Resources[] } = {};

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.checkScreenSize();
    this.category = this.dataService.getCategories();
    this.categories = this.dataService.getCategoriesData();
    this.buildSubcategoryNames();

    this.route.paramMap.subscribe((params: ParamMap) => {
      const categoria = params.get('categoria');
      if (categoria) {
        const idx = this.categories.findIndex(cat => cat.category === categoria);
        if (idx !== -1) {
          this.updateEstado(idx + 1, false);
        }
      }
    });
  }

  private checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
    }
  }

  updateEstado(newEstado: number, navigate: boolean = true) {
    this.isCategorySelected = true;
    this.state = newEstado;
    const categoryObj = this.getCategoryByState(newEstado);
    if (categoryObj) {
      this.dataService.getJson(categoryObj.category).subscribe(data => {
        this.data = data;
        this.filteredData = this.filterDataBySubcategories(data, categoryObj.subcategories);
        if (navigate) {
          this.router.navigate([`/categoria/${categoryObj.category}`]);
        }
      });
    }
  }

  getCategoryByState(estado: number): { category: string, subcategories: string[] } | null {
    return this.categories[estado - 1] || null;
  }

  buildSubcategoryNames(): void {
    this.subcategoryNames = {};
    this.categories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        const name = this.dataService.getSubCategoryName(subcategory);
        if (name) {
          this.subcategoryNames[subcategory] = name;
        }
      });
    });
  }

  filterDataBySubcategories(data: Resources[], subcategories: string[]): { [subcategory: string]: Resources[] } {
    const filtered: { [subcategory: string]: Resources[] } = {};
    subcategories.forEach(subcategory => {
      filtered[subcategory] = data.filter(item => item.subcategory === subcategory);
    });
    return filtered;
  }
}