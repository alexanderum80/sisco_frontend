import { TooltipService } from './../tooltip/tooltip.service';
import { FormGroup } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit, OnChanges {
  @Input() public fg: FormGroup;
  @Input() public control: string;
  @Input() public label: string;
  @Input() public floatLabel = false;
  @Input() public labelWidth: string;
  @Input() public mode: 'advanced' | 'basic' = 'basic';
  @Input() public multiple = false;
  @Input() public chooseLabel = '';
  @Input() public required = false;
  @Input() public disabled = false;
  @Input() tooltip: string = '';
  @Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' = 'right';

  uploadedFiles: any[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private _toolTipSvc: TooltipService
  ) {}

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.disabled) {
      this.fg.controls[this.control].disable();
    }
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.fg.controls[this.control].setValue(this.uploadedFiles);
  }
}
