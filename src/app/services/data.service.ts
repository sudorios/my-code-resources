import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resources } from '../interfaces/resources.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '~/interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})

export class DataService {

  private jsonUrl = 'assets/data.json';
  private dataSubject = new BehaviorSubject<Resources | null>(null);

  constructor(private http: HttpClient) { }

  //Category
  private categoryMap: { [key: string]: string } = {
    'design': 'Diseño UX/UI',
    'frontend': 'Frontend',
    'backend' : 'Backend',
    'IA' : 'IA',
    'english': 'Inglés',
    'other': 'Otros'
    };

  getCategories(): Category[] {
    return [
      { id: 1, name: 'Diseño UX/UI' },
      { id: 2, name: 'Backend' },
      { id: 3, name: 'Frontend' },
      { id: 4, name: 'IA' },
      { id: 5, name: 'Inglés' },
      { id: 6, name: 'Otros' }
    ];
  }

  mapCategory(category: string | null): string | null {
    return this.categoryMap[category || ''] || category;
  }

  private categoriesData: { category: string, subcategories: string[] }[] = [
    { category: 'design', subcategories: ['colors', 'fonts', 'icons', 'images'] },
    { category: 'backend', subcategories: ['learningTools', 'onlineCompilers', 'exercisesChallenges'] },
    { category: 'frontend', subcategories: ['onlineCompilers2', 'CSS_Tools', 'apis'] },
    { category: 'IA', subcategories: [
      'chats',
      'generate_imagesVideos',
      'generateAudio',
      'generateText',
      'others'
    ] },
    { category: 'english', subcategories: [
      'grammarVocabulary',
      'listeningSpeaking',
      'writing',
      'readingComprehension',
      'courseFree',
      'pronunciation'
    ] },
    { category: 'other', subcategories: ['extensions', 'security', 'dba'] },
  ];

  getCategoriesData() {
    return this.categoriesData;
  }

  //Subcategory

  private subCategoryMap: { [key: string]: string } = {
    colors: 'Generador de paletas de colores',
    fonts: 'Fuentes de texto',
    icons: 'Iconos y Gráficos',
    images: 'Recursos de Imágenes',
    learningTools: 'Visores de algoritmos',
    onlineCompilers: 'Compiladores backend Online',
    onlineCompilers2: 'Compiladores frontend Online',
    exercisesChallenges: 'Ejercicios y retos',
    CSS_Tools: 'Herramientas CSS',
    apis: 'API Testing',
    extensions: 'Extensiones de Visual Studio Code',
    security: 'Herramientas de Seguridad',
    dba: 'Herramientas DBA',
    chats: 'Chats de IA',
    generate_imagesVideos: 'Generadores de imágenes y videos',
    generateAudio: 'Generadores de audio',
    generateText: 'Generadores de texto', 
    others: 'Otros recursos de IA',
    grammarVocabulary: 'Gramática y vocabulario',
    listeningSpeaking: 'Escucha y habla',
    writing: 'Escritura',
    readingComprehension: 'Comprensión lectora',
    courseFree: 'Cursos gratuitos',
    pronunciation: 'Pronunciación'
  };


  getJson(category: string): Observable<Resources[]> {
    const params = new HttpParams().set('category', category);
    return this.http.get<Resources[]>(this.jsonUrl, { params })
  }

  getByName(name: string): Observable<Resources[]> {
    return this.http.get<Resources[]>(this.jsonUrl).pipe(
      map(data => this.filterByName(data, name))
    );
  }

  private filterByName(data: Resources[], name: string): Resources[] {
    return data.filter(item => item.name === name);
  }

  //Mapear datos

  getSubCategoryName(subcategory: string): string {
    return this.subCategoryMap[subcategory] || 'Nombre no disponible'; // Valor predeterminado
  }


  //Enviar datos
  setData(data: Resources): void {
    this.dataSubject.next(data);
  }
  getData(): Observable<Resources | null> {
    return this.dataSubject.asObservable();
  }
  
}