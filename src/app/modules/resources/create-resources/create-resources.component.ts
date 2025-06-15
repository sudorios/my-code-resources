import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Resources } from '~/interfaces/resources.interface';
import { DataService } from '~/services/data.service';

@Component({
  selector: 'app-create-resources',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-resources.component.html',
  styleUrl: './create-resources.component.css'
})
export class CreateResourcesComponent {
  maxLength: number = 100;
  remainingCharacters: number = this.maxLength;

  newResource: Resources = {
    name: '',
    description: '',
    url: '',
    category: '',
    subcategory: 'DEFAULT'
  };

  constructor(private dataService: DataService) { }

  onTextChange(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    this.remainingCharacters = this.maxLength - (input.value?.length || 0);
  }

 /* onSubmit() {
    this.dataService.addResource(this.newResource)
      .then(() => {
        console.log('Recurso creado exitosamente');
      })
      .catch(error => {
        console.error('Error al agregar el recurso:', error);
      });
  }*/

}
