import {Component, ViewEncapsulation, ViewChild, Inject, OnInit, AfterViewInit} from "@angular/core";
import {
  ConnectorConstraints,
  DiagramClickEventObject,
  DiagramComponent,
  DiagramMouseEventObject,
  DiagramTools, IClickEventArgs,
  ICollectionChangeEventArgs,
  IDraggingEventArgs,
  IDropEventArgs, IElement, IElementDrawEventArgs,
  IEndChangeEventArgs,
  IExportOptions,
  IHistoryChangeArgs,
  ISelectionChangeEventArgs,
  ITextEditEventArgs,
  NodeConstraints, PointModel,
  SelectorModel, Shape, ShapeModel, TextModel,
  ZoomOptions
} from "@syncfusion/ej2-angular-diagrams";
import {
  Diagram,
  NodeModel,
  UndoRedo,
  ConnectorModel,
  PointPortModel,
  Connector,
  FlowShapeModel,
  SymbolInfo,
  IDragEnterEventArgs,
  SnapSettingsModel,
  MarginModel,
  TextStyleModel,
  StrokeStyleModel,
  OrthogonalSegmentModel,
  Node,
  PaletteModel
} from "@syncfusion/ej2-diagrams";
import {ExpandMode, ItemModel, MenuEventArgs} from "@syncfusion/ej2-navigations";
import { paletteIconClick } from "../../../script/diagram-common";
import {ToolbarComponent} from "@syncfusion/ej2-angular-navigations";
import {AsyncSettingsModel} from "@syncfusion/ej2-inputs";
import {ClickEventArgs} from "@syncfusion/ej2-buttons";
import {HttpClient} from "@angular/common/http";
import {Configuration} from "../../../Config/Configuration";
import {
  AddConnectorCommand,
  AddNodeAnnotationCommand,
  AddNodeCommand,
  UpdateConnectorPositionCommand,
  UpdateConnectorSourcePointCommand,
  UpdateConnectorTargetPointCommand,
  UpdateNodePositionCommand
} from "../../../Models/commands";
import {ActivatedRoute, Router} from "@angular/router";
import {WhiteBoard} from "../../../Models/white-board";
import {Subject} from "rxjs";
import {debounceTime} from "rxjs/operators";
Diagram.Inject(UndoRedo);
@Component({
  selector: 'app-whiteboard-container',
  templateUrl: './whiteboard-container.component.html',
  styleUrls: ['./whiteboard-container.component.scss']
})
export class WhiteboardContainerComponent implements OnInit, AfterViewInit {
  @ViewChild('diagram')
  //Diagram Properties
  public diagram: DiagramComponent;
  @ViewChild('toolbar')
  public toolbar: ToolbarComponent;
  public whiteBoard: WhiteBoard;
  sourcePointChangedEvent$ = new Subject<IEndChangeEventArgs>();
  targetPointChangedEvent$ = new Subject<IEndChangeEventArgs>();
  nodePositionChangedEvent$ = new Subject<IDraggingEventArgs>();
  connectorPositionChangedEvent$ = new Subject<IDraggingEventArgs>();
  private currentSelection: SelectorModel | Diagram | DiagramClickEventObject | Object | DiagramMouseEventObject | NodeModel | IElement;
  private currentTextBox: any;
  constructor(private httpClient: HttpClient,
              private activateRoute: ActivatedRoute) {​​​​​​​
    //sourceFiles.files = ['../script/diagram-common.style.css'];
  }​​​​​​​
  ngOnInit(): void {
    this.activateRoute.params.subscribe(res => {
      this.getWhiteBoard(res['id']);
    });
    this.sourcePointChangedEvent$.pipe(debounceTime(500)).subscribe((event: IEndChangeEventArgs) => {
      const command = new UpdateConnectorSourcePointCommand();
      command.whiteBoardId = this.whiteBoard.id;
      command.connectorId = event.connector.id;
      command.sourcePoint = event.newValue;
      this.httpClient.post(Configuration.getUpdateSourcePointEndpoint(), command).subscribe(res => {

      });
    });
    this.targetPointChangedEvent$.pipe(debounceTime(500)).subscribe((event: IEndChangeEventArgs) => {
      const command = new UpdateConnectorTargetPointCommand();
      command.whiteBoardId = this.whiteBoard.id;
      command.connectorId = event.connector.id;
      command.targetPoint = event.newValue;
      this.httpClient.post(Configuration.getUpdateTargetPointEndpoint(), command).subscribe(res => {

      });
    });
  }
  getWhiteBoard(id: string) {
    this.httpClient.get<WhiteBoard>(Configuration.GetWhiteBoardApi(id)).subscribe(res => {
      this.whiteBoard = res;
      this.addNodeAnnotations();
      this.zoomContent();
    })
  }
  ngAfterViewInit(): void {
  }
  public terminator: FlowShapeModel = { type: 'Flow', shape: 'Terminator' };
  public process: FlowShapeModel = { type: 'Flow', shape: 'Process' };
  public decision: FlowShapeModel = { type: 'Flow', shape: 'Decision' };
  public data: FlowShapeModel = { type: 'Flow', shape: 'Data' };
  public directdata: FlowShapeModel = { type: 'Flow', shape: 'DirectData' };

  public margin: MarginModel = { left: 25, right: 25 };
  public connAnnotStyle: TextStyleModel = { fill: 'white' };
  public strokeStyle: StrokeStyleModel = { strokeDashArray: '2,2' };

  public segments: OrthogonalSegmentModel = [{ type: 'Orthogonal', direction: 'Top', length: 120 }];
  public segments1: OrthogonalSegmentModel = [
    { type: 'Orthogonal', direction: 'Right', length: 100 }
  ];
  public drawingObject : any;
  public asyncSettings: AsyncSettingsModel = {
    saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
    removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
  };

  public nodeDefaults(node: NodeModel): NodeModel {
    if (node.width === undefined) {
      node.width = 145;
    }
    node.style = { fill: '#357BD2', strokeColor: 'white' };

    if(node.annotations) {
      for (let i:number = 0; i < node.annotations.length; i++) {
        node.annotations[i].style = {
          color: 'white',
          fill: 'transparent',
        };
      }
    }
    node.ports = getPorts(node);
    return node;
  }
  public connDefaults(obj: Connector): void {
    if (obj.id.indexOf('connector') !== -1) {
      obj.targetDecorator = { shape: 'Arrow', width: 10, height: 10 };
    }
  }
  public created(): void {
    this.diagram.fitToPage({canZoomIn: false, mode: "Height", margin: {bottom: 0, left:0, top:0, right: 0}});
    this.addNodeAnnotations();
  }

  private addNodeAnnotations() {
    //NeedToChangeThis
    setTimeout(() => {
      console.log("triggered");
      if (this.whiteBoard) {
        for (let node of this.whiteBoard.nodes) {
          if (node.text) {
            const annotation = [{
              content: node.text
            }];
            const nodeModel = this.diagram.nodes.find(o => o.id === node.id);
            this.diagram.addNodeLabels(nodeModel, annotation);
          }
        }
      }
    }, 100);
  }

  public interval: number[] = [
    1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25,
    9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75
  ];

  public snapSettings: SnapSettingsModel = {
    horizontalGridlines: { lineColor: '#fffff', lineIntervals: this.interval },
    verticalGridlines: { lineColor: '#fffff', lineIntervals: this.interval }
  };

  public dragEnter(args: IDragEnterEventArgs): void {
    let obj: NodeModel = args.element as NodeModel;
    if (obj && obj.width && obj.height) {
      let oWidth: number = obj.width;
      let oHeight: number = obj.height;
      let ratio: number = 100 / obj.width;
      obj.width = 100;
      obj.height *= ratio;
      obj.offsetX! += (obj.width - oWidth) / 2;
      obj.offsetY! += (obj.height - oHeight) / 2;
      obj.style = { fill: '#357BD2', strokeColor: 'white' };
    }
  }

  //SymbolPalette Properties
  public symbolMargin: MarginModel = { left: 15, right: 15, top: 15, bottom: 15 };
  public expandMode: ExpandMode = 'Multiple';
  //Initialize the flowshapes for the symbol palatte
  private flowshapes: NodeModel[] = [
    { id: 'Terminator', shape: { type: 'Flow', shape: 'Terminator' } },
    { id: 'Process', shape: { type: 'Flow', shape: 'Process' } },
    { id: 'Decision', shape: { type: 'Flow', shape: 'Decision' } },
    { id: 'Document', shape: { type: 'Flow', shape: 'Document' } },
    { id: 'PreDefinedProcess', shape: { type: 'Flow', shape: 'PreDefinedProcess' } },
    { id: 'PaperTap', shape: { type: 'Flow', shape: 'PaperTap' } },
    { id: 'DirectData', shape: { type: 'Flow', shape: 'DirectData' } },
    { id: 'SequentialData', shape: { type: 'Flow', shape: 'SequentialData' } },
    { id: 'Sort', shape: { type: 'Flow', shape: 'Sort' } },
    { id: 'MultiDocument', shape: { type: 'Flow', shape: 'MultiDocument' } },
    { id: 'Collate', shape: { type: 'Flow', shape: 'Collate' } },
    { id: 'SummingJunction', shape: { type: 'Flow', shape: 'SummingJunction' } },
    { id: 'Or', shape: { type: 'Flow', shape: 'Or' } },
    {
      id: 'InternalStorage',
      shape: { type: 'Flow', shape: 'InternalStorage' }
    },
    { id: 'Extract', shape: { type: 'Flow', shape: 'Extract' } },
    {
      id: 'ManualOperation',
      shape: { type: 'Flow', shape: 'ManualOperation' }
    },
    { id: 'Merge', shape: { type: 'Flow', shape: 'Merge' } },
    {
      id: 'OffPageReference',
      shape: { type: 'Flow', shape: 'OffPageReference' }
    },
    {
      id: 'SequentialAccessStorage',
      shape: { type: 'Flow', shape: 'SequentialAccessStorage' }
    },
    { id: 'Annotation', shape: { type: 'Flow', shape: 'Annotation' } },
    { id: 'Annotation2', shape: { type: 'Flow', shape: 'Annotation2' } },
    { id: 'Data', shape: { type: 'Flow', shape: 'Data' } },
    { id: 'Card', shape: { type: 'Flow', shape: 'Card' } },
    { id: 'Delay', shape: { type: 'Flow', shape: 'Delay' } }
  ];

  //Initializes connector symbols for the symbol palette
  private connectorSymbols: ConnectorModel[] = [
    {
      id: 'Link1',
      type: 'Orthogonal',
      sourcePoint: { x: 0, y: 0 },
      targetPoint: { x: 60, y: 60 },
      targetDecorator: { shape: 'Arrow', style: {strokeColor: '#757575', fill: '#757575'} },
      style: { strokeWidth: 1, strokeColor: '#757575' }
    },
    {
      id: 'link3',
      type: 'Orthogonal',
      sourcePoint: { x: 0, y: 0 },
      targetPoint: { x: 60, y: 60 },
      style: { strokeWidth: 1, strokeColor: '#757575' },
      targetDecorator: { shape: 'None' }
    },
    {
      id: 'Link21',
      type: 'Straight',
      sourcePoint: { x: 0, y: 0 },
      targetPoint: { x: 60, y: 60 },
      targetDecorator: { shape: 'Arrow', style: {strokeColor: '#757575', fill: '#757575'} },
      style: { strokeWidth: 1, strokeColor: '#757575' }
    },
    {
      id: 'link23',
      type: 'Straight',
      sourcePoint: { x: 0, y: 0 },
      targetPoint: { x: 60, y: 60 },
      style: { strokeWidth: 1, strokeColor: '#757575' },
      targetDecorator: { shape: 'None' }
    },
    {
      id: 'link33',
      type: 'Bezier',
      sourcePoint: { x: 0, y: 0 },
      targetPoint: { x: 60, y: 60 },
      style: { strokeWidth: 1, strokeColor: '#757575' },
      targetDecorator: { shape: 'None' }
    }
  ];

  public palettes: PaletteModel[] = [
    {
      id: 'flow',
      expanded: true,
      symbols: this.flowshapes,
      iconCss: 'shapes',
      title: 'Flow Shapes'
    },
    {
      id: 'connectors',
      expanded: true,
      symbols: this.connectorSymbols,
      iconCss: 'shapes',
      title: 'Connectors'
    }
  ];

  public getSymbolInfo(symbol: NodeModel): SymbolInfo {
    return { fit: true };
  }

  public getSymbolDefaults(symbol: NodeModel): void {
    symbol.style.strokeColor = '#757575';
    if (symbol.id === 'Terminator' || symbol.id === 'Process') {
      symbol.width = 80;
      symbol.height = 40;
    } else if (
      symbol.id === 'Decision' ||
      symbol.id === 'Document' ||
      symbol.id === 'PreDefinedProcess' ||
      symbol.id === 'PaperTap' ||
      symbol.id === 'DirectData' ||
      symbol.id === 'MultiDocument' ||
      symbol.id === 'Data'
    ) {
      symbol.width = 50;
      symbol.height = 40;
    } else {
      symbol.width = 50;
      symbol.height = 50;
    }
  }
  public selectionChange(args: ISelectionChangeEventArgs): void {
    if(args.state === 'Changed'){
      var selectedItems = this.diagram.selectedItems.nodes;
      selectedItems = selectedItems!.concat(this.diagram.selectedItems.connectors as any);
      if(selectedItems.length===0){
        this.toolbar.items[6].disabled = true;
        this.toolbar.items[7].disabled = true;
        this.toolbar.items[19].disabled = true;
        this.toolbar.items[20].disabled = true;
        this.toolbar.items[25].disabled = true;
        this.toolbar.items[29].disabled = true;
        this.toolbar.items[31].disabled = true;
        this.disableMultiselectedItems();
      }
      if(selectedItems.length === 1){

        this.enableItems();
        this.disableMultiselectedItems();

        if(selectedItems[0].children !== undefined && selectedItems[0].children.length>0){
          this.toolbar.items[27].disabled = false;
        }
        else{
          this.toolbar.items[27].disabled = true;
        }

      }

      if(selectedItems.length > 1){
        this.enableItems();
        this.toolbar.items[22].disabled = false;
        this.toolbar.items[23].disabled = false;
        this.toolbar.items[27].disabled = false;
        if(selectedItems.length>2){
          this.toolbar.items[23].disabled = false;
        }
        else{
          this.toolbar.items[23].disabled = true;
        }
      }

    }
  }
  public historyChange(args: IHistoryChangeArgs): void {
    if(this.diagram.historyManager.undoStack!.length>0){
      this.toolbar.items[10].disabled = false;
    }
    else{
      this.toolbar.items[10].disabled = true;
    }
    if(this.diagram.historyManager.redoStack!.length>0){
      this.toolbar.items[11].disabled = false;
    }
    else{
      this.toolbar.items[11].disabled = true;
    }
  }
  public enableItems()
  {
    this.toolbar.items[6].disabled = false;
    this.toolbar.items[7].disabled = false;
    this.toolbar.items[19].disabled = false;
    this.toolbar.items[20].disabled = false;
    this.toolbar.items[25].disabled = false;
    this.toolbar.items[29].disabled = false;
    this.toolbar.items[31].disabled = false;
  }
  public disableMultiselectedItems()
  {
    this.toolbar.items[22].disabled = true;
    this.toolbar.items[23].disabled = true;
    this.toolbar.items[27].disabled = true;
  }

  public clicked(args : ClickEventArgs){
    var item = (args as any).item.tooltipText;
    switch(item)
    {
      case 'Undo':
        this.diagram.undo();
        break;
      case 'Redo':
        this.diagram.redo();
        break;
      case 'Lock':
        this.lockObject();
        break;
      case 'Cut':
        this.diagram.cut();
        this.toolbar.items[8].disabled = false;
        break;
      case 'Copy':
        this.diagram.copy();
        this.toolbar.items[8].disabled = false;
        break;
      case 'Paste':
        this.diagram.paste();
        break;
      case'Delete':
        this.diagram.remove();
        break;
      case 'Select Tool':
        this.diagram.clearSelection();
        this.diagram.tool = DiagramTools.Default;
        break;
      case 'Text Tool':
        this.diagram.clearSelection();
        this.diagram.selectedItems.userHandles = [];
        this.diagram.drawingObject = { shape: { type: 'Text' }};
        this.diagram.tool = DiagramTools.ContinuousDraw;
        break;
      case 'Pan Tool':
        this.diagram.clearSelection();
        this.diagram.tool = DiagramTools.ZoomPan;
        break;
      case 'New Diagram':
        this.diagram.clear();
        this.historyChange(args as any);
        break;
      case 'Print Diagram':
        this.printDiagram(args);
        break;
      case 'Save Diagram':
        this.download(this.diagram.saveDiagram());
        break;
      case 'Open Diagram':
        document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')!.click();
        break;
    }
    this.diagram.dataBind();
  }


  public zoomMenuItems = [
    { text: 'Zoom In' },
    { text: 'Zoom Out' },{ text: 'Zoom to Fit' },
    { text: 'Zoom to 50%' },
    { text: 'Zoom to 100%' },
    { text: 'Zoom to 200%' },
  ]

// To perform zoom operation
  public zoomChange(args : any){
    var currentZoom = this.diagram.scrollSettings.currentZoom;
    var zoom : ZoomOptions = {};
    switch (args.item.text) {
      case 'Zoom In':
        this.diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 });
        break;
      case 'Zoom Out':
        this.diagram.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 });
        break;
      case 'Zoom to Fit':
        zoom.zoomFactor = 1 / currentZoom! - 1;
        this.diagram.zoomTo(zoom);
        break;
      case 'Zoom to 50%':
        if(currentZoom === 0.5){
          currentZoom = 0;
          zoom.zoomFactor = (0.5 / currentZoom) - 1;
          this.diagram.zoomTo(zoom);

        }
        else{
          zoom.zoomFactor = (0.5 / currentZoom!) - 1;
          this.diagram.zoomTo(zoom);
        }
        break;

      case 'Zoom to 100%':
        if(currentZoom === 1){
          currentZoom = 0;
          zoom.zoomFactor = (1 / currentZoom) - 1;
          this.diagram.zoomTo(zoom);
        }
        else{
          zoom.zoomFactor = (1 / currentZoom!) - 1;
          this.diagram.zoomTo(zoom);
        }
        break;
      case 'Zoom to 200%':
        if(currentZoom === 2){
          currentZoom = 0;
          zoom.zoomFactor = (2 / currentZoom) - 1;
          this.diagram.zoomTo(zoom);
        }
        else{
          zoom.zoomFactor = (2 / currentZoom!) - 1;
          this.diagram.zoomTo(zoom);
        }
        break;
    }
  }

  public onConnectorSelect(args : any){
    debugger
    this.diagram.clearSelection();
    this.diagram.drawingObject = {type:args.item.text};
    this.diagram.tool = DiagramTools.ContinuousDraw;
    this.diagram.selectedItems.userHandles = [];
    this.diagram.dataBind();
  }
  public conTypeItems = [
    {text: 'Straight',iconCss: 'e-icons e-line'},
    {text: 'Orthogonal',iconCss: 'sf-icon-orthogonal'},
    {text: 'Bezier',iconCss: 'sf-icon-bezier'}
  ];

  public shapesItems = [
    {text: 'Rectangle',iconCss: 'e-rectangle e-icons'},

    {text: 'Ellipse',iconCss: ' e-circle e-icons'}, {text: 'Polygon',iconCss: 'e-line e-icons'}
  ];

  public onShapesSelect(args : any){
    this.diagram.clearSelection();
    this.diagram.drawingObject = {shape:{shape:args.item.text}};
    this.diagram.tool = DiagramTools.ContinuousDraw;
    this.diagram.selectedItems.userHandles = [];
    this.diagram.dataBind();
  }
//Export the diagraming object based on the format.

  public groupItems = [
    {text:'Group',iconCss:'e-icons e-group-1'},
    {text:'Ungroup',iconCss:'e-icons e-ungroup-1'}
  ];
  public onSelectGroup(args: any){
    if(args.item.text === 'Group'){
      this.diagram.group();
    }
    else if(args.item.text === 'Ungroup'){
      this.diagram.unGroup();
    }
  }

  public alignItems = [
    {
      iconCss: 'sf-icon-align-left-1', text: 'Align Left',
    },
    {
      iconCss: 'sf-icon-align-center-1', text: 'Align Center',
    },
    {
      iconCss: 'sf-icon-align-right-1', text: 'Align Right',
    },
    {
      iconCss: 'sf-icon-align-top-1', text: 'Align Top',
    },
    {
      iconCss: 'sf-icon-align-middle-1', text: 'Align Middle',
    },
    {
      iconCss: 'sf-icon-align-bottom-1', text: 'Align Bottom',
    },
  ];

  public onSelectAlignObjects(args : any){
    var item = args.item.text;
    var alignType = item.replace('Align', '');
    var alignType1 = alignType.charAt(0).toUpperCase() + alignType.slice(1);
    this.diagram.align(alignType1.trim());
  }
  public distributeItems = [
    { iconCss: 'sf-icon-distribute-vertical', text: 'Distribute Objects Vertically',},
    { iconCss: 'sf-icon-distribute-horizontal', text: 'Distribute Objects Horizontally',},
  ];

  public onSelectDistributeObjects(args : any){
    if(args.item.text === 'Distribute Objects Vertically'){
      this.diagram.distribute('BottomToTop');
    }
    else{
      this.diagram.distribute('RightToLeft');
    }
  }

  public orderItems = [
    { iconCss: 'e-icons e-bring-forward', text: 'Bring Forward'},
    { iconCss: 'e-icons e-bring-to-front', text: 'Bring To Front'},
    { iconCss: 'e-icons e-send-backward', text: 'Send Backward'},
    { iconCss: 'e-icons e-send-to-back', text: 'Send To Back'}
  ];
  public onSelectOrder(args : any){
    switch(args.item.text){
      case 'Bring Forward':
        this.diagram.moveForward();
        break;
      case 'Bring To Front':
        this.diagram.bringToFront();
        break;
      case 'Send Backward':
        this.diagram.sendBackward();
        break;
      case 'Send To Back':
        this.diagram.sendToBack();
        break;
    }
  }

  public rotateItems = [
    {iconCss:'e-icons e-transform-right',text: 'Rotate Clockwise'},
    {iconCss:'e-icons e-transform-left',text: 'Rotate Counter-Clockwise'}
  ];


  public onSelectRotate(args : any){
    if(args.item.text === 'Rotate Clockwise'){
      this.diagram.rotate(this.diagram.selectedItems,90);
    }
    else{
      this.diagram.rotate(this.diagram.selectedItems,-90);
    }
  }

  public flipItems = [
    {iconCss:'e-icons e-flip-horizontal',text: 'Flip Horizontal'},
    {iconCss:'e-icons e-flip-vertical',text: 'Flip Vertical'}
  ];
  public onSelectFlip(args : any){
    this.flipObjects(args.item.text);
  }

// To flip diagram objects
  public flipObjects(flipType : any)
  {
    var selectedObjects = this.diagram.selectedItems.nodes!.concat(this.diagram.selectedItems.connectors as any);
    for( let i : number=0; i< selectedObjects.length;i++)
    {
      selectedObjects[i].flip = flipType === 'Flip Horizontal'? 'Horizontal':'Vertical';
    }
    this.diagram.dataBind();
  }
  public lockObject () {
    for (let i : number = 0; i < this.diagram.selectedItems.nodes!.length; i++) {
      let node = this.diagram.selectedItems.nodes![i];
      if (node.constraints! & NodeConstraints.Drag) {
        node.constraints = NodeConstraints.PointerEvents | NodeConstraints.Select;
      } else {
        node.constraints = NodeConstraints.Default;
      }
    }
    for (let j : number = 0; j < this.diagram.selectedItems.connectors!.length; j++) {
      let connector = this.diagram.selectedItems.connectors![j];
      if (connector.constraints! & ConnectorConstraints.Drag) {
        connector.constraints = ConnectorConstraints.PointerEvents | ConnectorConstraints.Select;
      } else {
        connector.constraints = ConnectorConstraints.Default;
      }
    }
    this.diagram.dataBind();
  }
  public zoomContent()
  {
    if(this.diagram)
      return Math.round(this.diagram.scrollSettings.currentZoom!*100) + ' %'
    return "";
  };
  public printDiagram(args : any){
    var options : IExportOptions = {};
    options.mode = 'Download';
    options.region = 'Content';
    options.multiplePage = this.diagram.pageSettings.multiplePage;
    options.pageHeight = this.diagram.pageSettings.height;
    options.pageWidth = this.diagram.pageSettings.width;
    this.diagram.print(options);
  }
  public onselectExport(args : any) {
    var exportOptions : IExportOptions = {};
    exportOptions.format = args.item.text;
    exportOptions.mode = 'Download';
    exportOptions.region = 'PageSettings';
    exportOptions.fileName = 'Export';
    exportOptions.margin = { left: 0, top: 0, bottom: 0, right: 0 };
    this.diagram.exportDiagram(exportOptions);
  }

  public download(data : string) : void{
    if ((window.navigator as any).msSaveBlob) {
      let blob: Blob = new Blob([data], { type: 'data:text/json;charset=utf-8,' });
      (window.navigator as any).msSaveOrOpenBlob(blob, 'Diagram.json');
    } else {
      let dataStr: string = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
      let a: HTMLAnchorElement = document.createElement('a');
      a.href = dataStr;
      a.download = 'Diagram.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }
  public onUploadSuccess(args: { [key: string]: Object }): void {
    debugger
    let file1: { [key: string]: Object } = args['file'] as { [key: string]: Object };
    let file: Blob = file1['rawFile'] as Blob;
    let reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = this.loadDiagram.bind(this);
  }

  public loadDiagram(event: ProgressEvent): void {
    this.diagram.loadDiagram((event.target as FileReader).result.toString());
  }

  public items: ItemModel[] = [
    {text:'JPG'},{text:'PNG'},{text:'SVG'}

  ];
  public addDisabled(args: MenuEventArgs) {
    this.onselectExport(args);
  }

  public diagramCreate(args: Object): void {
    paletteIconClick();
  }

  onDropSymbol($event: IDropEventArgs) {
    if($event.element instanceof Node) {
      this.createNode($event.element.height, $event.element.width, $event.position, {type: $event.element.shape.type, shape: ($event.element.shape as FlowShapeModel).shape});
    }
    if($event.element instanceof Connector) {
      var addConnectorCommand = new AddConnectorCommand();
      addConnectorCommand.whiteBoardId = this.whiteBoard.id;
      addConnectorCommand.type = $event.element.type;
      addConnectorCommand.sourcePoint = {x: $event.element.sourcePoint.x, y: $event.element.sourcePoint.y};
      addConnectorCommand.targetPoint = {x: $event.element.targetPoint.x, y: $event.element.targetPoint.y};
      this.httpClient.post(Configuration.addConnectorApi(), addConnectorCommand).subscribe(res => {
        this.getWhiteBoard(this.whiteBoard.id);
      });
    }
  }

  private createNode(height: number, width: number, position: PointModel, shape: any, text: string = '') {
    var addNodeCommand = new AddNodeCommand();
    addNodeCommand.whiteBoardId = this.whiteBoard.id;
    addNodeCommand.height = height;
    addNodeCommand.width = width;
    addNodeCommand.position = position;
    addNodeCommand.shape = shape;
    addNodeCommand.text = text;
    //addNodeCommand.shape = {type: $event.element.shape.type, shape: ($event.element.shape as FlowShapeModel).shape};
    this.httpClient.post(Configuration.addNodeApi(), addNodeCommand).subscribe(res => {
      this.getWhiteBoard(this.whiteBoard.id);
    });
  }

  onTextEdit($event: ITextEditEventArgs) {
    console.log('Text Edit');
    if($event.element instanceof Node) {
      const command = new AddNodeAnnotationCommand();
      command.whiteBoardId = this.whiteBoard.id;
      command.nodeId = $event.element.id;
      command.text = $event.newValue;
      this.httpClient.post(Configuration.getAddAnnotationApi(), command).subscribe(res => {
        this.getWhiteBoard(this.whiteBoard.id);
      });
    }
  }

  onDataLoaded($event: any) {
    this.addNodeAnnotations();
  }

  onCollectionChange($event: ICollectionChangeEventArgs) {
    console.log('CollectionChange: ', $event);
  }
  onSourcePointChange($event: IEndChangeEventArgs) {
    this.sourcePointChangedEvent$.next($event);
  }

  onPositionChange($event: IDraggingEventArgs) {
    console.log("Event: ", $event);
    if($event.state === 'Completed') {
      if(this.currentSelection && this.currentSelection instanceof Node) {
        const command = new UpdateNodePositionCommand();
        command.nodeId = this.currentSelection.id;
        command.whiteBoardId = this.whiteBoard.id;
        command.position = {x: $event.newValue.offsetX, y: $event.newValue.offsetY}
        this.httpClient.post(Configuration.updateNodePositionApi(), command).subscribe(res => {

        });
      }
      if(this.currentSelection && this.currentSelection instanceof Connector) {
        const command = new UpdateConnectorPositionCommand();
        command.connectorId = this.currentSelection.id;
        command.whiteBoardId = this.whiteBoard.id;
        command.targetPoint = {x: this.currentSelection.targetPoint.x, y: this.currentSelection.targetPoint.y};
        command.sourcePoint = {x: this.currentSelection.sourcePoint.x, y: this.currentSelection.sourcePoint.y};
        this.httpClient.post(Configuration.updateConnectorPositionApi(), command).subscribe(res => {

        });
      }
    }
  }
  onMouseOver($event: any) {
    this.currentSelection = $event.actualObject;
  }

  onMouseLeave($event: any) {
    this.currentSelection = null;
  }

  onTargetPointChange($event: IEndChangeEventArgs) {
    this.targetPointChangedEvent$.next($event);
  }

  onPropertyChange($event: any) {
    console.log($event);
  }

  onElementDraw($event: IElementDrawEventArgs) {
    console.log("Drawing: ", $event);
    if($event.state === 'Completed') {
      if($event.source instanceof Node) {
        this.createNode($event.source.height, $event.source.width, {x: $event.source.offsetX, y: $event.source.offsetY}, {type: $event.source.shape.type, shape: ($event.source.shape as FlowShapeModel).shape});
      }
    }
  }

  onDiagramClick($event: IClickEventArgs) {
    //debugger
    if(!this.currentTextBox && $event.actualObject instanceof Node) {
      this.currentTextBox = $event.actualObject;
    }
    if(this.currentTextBox && $event.element instanceof Node) {
      if((this.currentTextBox.shape as TextModel).content.length > 0) {
        this.createNode(this.currentTextBox.height, this.currentTextBox.width, {x: this.currentTextBox.offsetX, y: this.currentTextBox.offsetY}, {type: this.currentTextBox.shape.type, shape: 'Rect'},  (this.currentTextBox.shape as TextModel).content);
      }
      this.currentTextBox = $event.actualObject;
    }
  }
}
function getPorts(obj: NodeModel): PointPortModel[] {
  let ports: PointPortModel[] = [
    { id: 'port1', shape: 'Circle', offset: { x: 0, y: 0.5 } },
    { id: 'port2', shape: 'Circle', offset: { x: 0.5, y: 1 } },
    { id: 'port3', shape: 'Circle', offset: { x: 1, y: 0.5 } },
    { id: 'port4', shape: 'Circle', offset: { x: 0.5, y: 0 } }
  ];
  return ports;
}
