import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'png-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() fg: FormGroup;
  @Input() label: string;
  @Input() floatLabel = false;
  @Input() labelWidth: string;
  @Input() control: string;
  @Input() view: 'date' | 'month' = 'date';
  @Input() dateFormat = 'dd/mm/yy';
  @Input() showIcon = true;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Input() readonlyInput = true;
  @Input() disabledDays: number[] = [];
  @Input() monthNavigator = true;
  @Input() yearNavigator = true;
  @Input() yearRange: string = (new Date()).getFullYear() - 10 + ':' + (new Date()).getFullYear();
  @Input() showTime = false;
  @Input() timeOnly = false;
  @Input() selectionMode: 'single' | 'multiple' | 'range' = 'single';
  @Input() showButtonBar = true;
  @Input() required = false;
  @Input() disabled = false;

  constructor(
    private config: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.config.setTranslation({
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      today: 'Hoy',
      clear: 'Limpiar'
    });
  }

}
