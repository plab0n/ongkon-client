import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WhiteboardContainerComponent} from "./components/whiteboard-container/whiteboard-container.component";

const routes: Routes = [
  {
    path: 'whiteboard/:id',
    component: WhiteboardContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
