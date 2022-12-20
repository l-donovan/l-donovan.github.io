import {
  Component, OnInit, ElementRef, ViewChild, Renderer2,
  Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {
  @ViewChild('outline') outline: ElementRef<HTMLDivElement>;
  @ViewChild('window') window: ElementRef<HTMLDivElement>;

  @Input() title = 'untitled';
  @Input() id = -1;
  @Input() menus = [
    {
      "name": "File",
      "items": [
        {
          "name": "New",
          "action": "/file/new"
        },
        {
          "name": "Open",
          "action": ""
        },
        {
          "name": "Save",
          "action": ""
        }
      ]
    },
    {
      "name": "Edit",
      "items": [
      ]
    }
  ];

  @Output() menuChoice = new EventEmitter<string>();
  @Output() windowAction = new EventEmitter<string>();

  posX = 0;
  posY = 0;
  startX = 0;
  startY = 0;
  offsetX = 0;
  offsetY = 0;
  startW = 0;
  startH = 0;
  newW = 0;
  newH = 0;

  draggable = true;
  resizable = true;

  constructor(private renderer: Renderer2) {
  }

  doWindowAction(action: string) {
    this.windowAction.emit(action);
  }

  ngOnInit(): void {
  }

  onMenuSelect(action: string): void {
    this.menuChoice.emit(action);
    console.log(action);
  }

  moveMouseDown(event: MouseEvent): void {
    if (!this.draggable) {
      return;
    }

    event = event || window.event;
    event.preventDefault();

    this.offsetX = this.posX;
    this.offsetY = this.posY;
    this.startX = event.clientX;
    this.startY = event.clientY;

    // Update dimensions and unhide outline box
    let width = this.window.nativeElement.clientWidth;
    let height = this.window.nativeElement.clientHeight;
    this.renderer.setStyle(this.outline.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.outline.nativeElement, 'width', width + 'px')
    this.renderer.setStyle(this.outline.nativeElement, 'height', height + 'px')

    // Register event handlers
    document.onmouseup = this.createMouseUp(this);
    document.onmousemove = this.createMouseMove(this);
  }

  createMouseUp(comp: WindowComponent): (event: MouseEvent) => void {
    return function(_event: MouseEvent): void {
      // Deregister event handlers
      document.onmouseup = null;
      document.onmousemove = null;

      // Hide outline box
      comp.renderer.setStyle(comp.outline.nativeElement, 'display', 'none');

      // Draw window at new position
      comp.renderer.setStyle(comp.window.nativeElement, 'top', comp.posY + 'px');
      comp.renderer.setStyle(comp.window.nativeElement, 'left', comp.posX + 'px');
    }
  }

  createMouseMove(comp: WindowComponent): (event: MouseEvent) => void {
    return function(event: MouseEvent) {
      event = event || window.event;
      event.preventDefault();

      comp.posX = comp.offsetX + event.clientX - comp.startX;
      comp.posY = comp.offsetY + event.clientY - comp.startY;

      comp.renderer.setStyle(comp.outline.nativeElement, 'top', comp.posY + 'px');
      comp.renderer.setStyle(comp.outline.nativeElement, 'left', comp.posX + 'px');
    }
  }

  createResizeMouseUp(comp: WindowComponent): (event: MouseEvent) => void {
    return function(_event: MouseEvent): void {
      // Deregister event handlers
      document.onmouseup = null;
      document.onmousemove = null;

      // Draw window with new dimensions
      let width = comp.outline.nativeElement.clientWidth;
      let height = comp.outline.nativeElement.clientHeight;
      comp.renderer.setStyle(comp.window.nativeElement, 'width', width + 'px')
      comp.renderer.setStyle(comp.window.nativeElement, 'height', height + 'px')
      comp.renderer.setStyle(comp.window.nativeElement, 'top', comp.posY + 'px');
      comp.renderer.setStyle(comp.window.nativeElement, 'left', comp.posX + 'px');

      // Hide outline box
      comp.renderer.setStyle(comp.outline.nativeElement, 'display', 'none');
    }
  }

  createResizeMouseMove(comp: WindowComponent, direction: string): (event: MouseEvent) => void {
    return function(event: MouseEvent) {
      event = event || window.event;
      event.preventDefault();

      if (direction.startsWith('bottom')) {
        comp.newH = comp.startH + event.clientY - comp.startY;
        comp.renderer.setStyle(comp.outline.nativeElement, 'height', comp.newH + 'px');
      } else if (direction.startsWith('top')) {
        comp.newH = comp.startH - event.clientY + comp.startY;
        comp.posY = comp.offsetY + event.clientY - comp.startY;
        comp.renderer.setStyle(comp.outline.nativeElement, 'height', comp.newH + 'px');
        comp.renderer.setStyle(comp.outline.nativeElement, 'top', comp.posY + 'px');
      }

      if (direction.endsWith('left')) {
        comp.newW = comp.startW - event.clientX + comp.startX;
        comp.posX = comp.offsetX + event.clientX - comp.startX;
        comp.renderer.setStyle(comp.outline.nativeElement, 'width', comp.newW + 'px');
        comp.renderer.setStyle(comp.outline.nativeElement, 'left', comp.posX + 'px');
      } else if (direction.endsWith('right')) {
        comp.newW = comp.startW + event.clientX - comp.startX;
        comp.renderer.setStyle(comp.outline.nativeElement, 'width', comp.newW + 'px');
      }
    }
  }

  resizeMouseDown(event: MouseEvent, direction: string): void {
    if (!this.resizable) {
      return;
    }

    event = event || window.event;
    event.preventDefault();

    this.offsetX = this.posX;
    this.offsetY = this.posY;
    this.startX = event.clientX;
    this.startY = event.clientY;

    // Update dimensions and unhide outline box
    let width = this.window.nativeElement.clientWidth;
    let height = this.window.nativeElement.clientHeight;
    this.startW = width;
    this.startH = height;
    this.renderer.setStyle(this.outline.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.outline.nativeElement, 'width', width + 'px')
    this.renderer.setStyle(this.outline.nativeElement, 'height', height + 'px')

    // Register event handlers
    document.onmouseup = this.createResizeMouseUp(this);
    document.onmousemove = this.createResizeMouseMove(this, direction);
  }
}

