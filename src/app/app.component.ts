/**
 * Default FlowShape sample
 */
import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {WhiteboardInfoDialogComponent} from "./components/whiteboard-info-dialog/whiteboard-info-dialog.component";
import {Configuration} from "../Config/Configuration";
import {CreateWhiteBoardCommand} from "../Models/commands";


@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{

  constructor(private httpClient: HttpClient,
              private router: Router,
              private dialog: MatDialog) {​​​​​​​
  }​​​​​​​

  ngOnInit(): void {
    this.openWhiteBoardInfoDialog();
  }
  private openWhiteBoardInfoDialog() {
    const dialogRef = this.dialog.open(WhiteboardInfoDialogComponent, {
      disableClose: true,
      height: '230px',
      width: '220px',
      data: {

      }
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log('DialogResponse', res);
      this.httpClient.post(Configuration.createEmptyWhiteBoardApi(), new CreateWhiteBoardCommand(res.whiteBoardTitle, res.userName)).subscribe((response: any) => {
        this.router.navigateByUrl('/whiteboard/' + response.id);
      });
    });
  }
}

