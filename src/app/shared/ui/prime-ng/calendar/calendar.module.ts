import { PrimeNGConfig } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [CalendarComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        TooltipModule,
    ],
    exports: [CalendarModule, CalendarComponent],
})
export class PrimeCalendarModule {
    constructor(private config: PrimeNGConfig) {
        this.config.setTranslation({
            dayNames: [
                'Domingo',
                'Lunes',
                'Martes',
                'Miércoles',
                'Jueves',
                'Viernes',
                'Sábado',
            ],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            monthNames: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre',
            ],
            monthNamesShort: [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic',
            ],
            dateFormat: 'Formato de fecha',
            today: 'Hoy',
        });
    }
}
