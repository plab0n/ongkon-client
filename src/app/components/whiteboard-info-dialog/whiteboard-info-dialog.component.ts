import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
interface DialogData {
  userName: string;
  whiteBoardTitle: string;
}
@Component({
  selector: 'app-whiteboard-info-dialog',
  templateUrl: './whiteboard-info-dialog.component.html',
  styleUrls: ['./whiteboard-info-dialog.component.scss']
})
export class WhiteboardInfoDialogComponent {
  constructor(public dialogRef: MatDialogRef<WhiteboardInfoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }
}
