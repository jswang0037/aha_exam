import { Component, OnInit } from '@angular/core';
import SwaggerUI from 'swagger-ui';
import customerApiDoc from 'openapi.json'
import { ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-swagger-ui',
  templateUrl: './swagger-ui.component.html',
  styleUrls: ['./swagger-ui.component.css']
})
export class SwaggerUiComponent implements OnInit {

  @ViewChild('customerapidocumentation',{static: true}) custApiDocElement: ElementRef | undefined

  constructor(){}

  ngOnInit(): void {
    console.log(customerApiDoc)
    const apiDocumentation = customerApiDoc;
    const ui = SwaggerUI({
      spec: apiDocumentation,
      //domNode: this.custApiDocElement?.nativeElement,
      domNode: document.getElementById('customer-api-documentation'),
      //dom_id: 'customer-api-documentation'
    })
  }
}