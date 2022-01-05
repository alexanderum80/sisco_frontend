import { FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'am-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ]
})
export class DatePickerComponent implements OnInit {
  @Input() formatMMYYYY = false;
  @Input() label: string;
  @Input() placeholder = 'Seleciona una fecha...';
  @Input() fg: FormGroup;
  @Input() control: string;
  @Input() disabled = false;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  chosenYearHandler(normalizedYear: Moment): void {
    const ctrlValue = this.fg.controls[this.control].value;
    ctrlValue.year(normalizedYear.year());
    this.fg.controls[this.control].setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>): void {
    const ctrlValue = this.fg.controls[this.control].value;
    ctrlValue.year(normalizedMonth.year());
    ctrlValue.month(normalizedMonth.month());
    this.fg.controls[this.control].setValue(ctrlValue);
    datepicker.close();
  }

}
