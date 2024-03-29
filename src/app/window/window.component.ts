import {
  Component, OnInit, ElementRef, ViewChild, Renderer2,
  Input, Output, EventEmitter } from '@angular/core';
import { WindowContentService } from '../window-content.service';

type Nullable<T> = T | null;
type Handler<T> = (event: T) => void; 

@Component({
  selector: 'app-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit {
  @ViewChild('outline') outline: ElementRef<HTMLDivElement>;
  @ViewChild('window') window: ElementRef<HTMLDivElement>;

  @Input() title = 'untitled';
  @Input() icon = "";

  @Input() draggable = true;
  @Input() resizable = true;
  @Input() content = '';

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
  oldWidth = 0; 
  htmlContent: string;

  oldHeight = 0;
  maximized = false;
  selectedMenu = "";

  constructor(private renderer: Renderer2, private windowContent: WindowContentService) {}

  doWindowAction(action: string) {
    if (action === "resize") {
      if (this.maximized) {
        this.renderer.setStyle(this.window.nativeElement, 'top', this.posY + 'px');
        this.renderer.setStyle(this.window.nativeElement, 'left', this.posX + 'px');
        this.renderer.setStyle(this.window.nativeElement, 'width', this.oldWidth + 'px');
        this.renderer.setStyle(this.window.nativeElement, 'height', this.oldHeight + 'px');
      } else {
        this.oldWidth = this.window.nativeElement.clientWidth;
        this.oldHeight = this.window.nativeElement.clientHeight;

        let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        width -= 6;
        height -= 34 + 6;

        this.renderer.setStyle(this.window.nativeElement, 'top', '0');
        this.renderer.setStyle(this.window.nativeElement, 'left', '0');
        this.renderer.setStyle(this.window.nativeElement, 'width', width + 'px');
        this.renderer.setStyle(this.window.nativeElement, 'height', height + 'px');
      }

      this.maximized = !this.maximized;
    } else {
      this.windowAction.emit(action);
    }
  }

  ngOnInit(): void {
    this.windowContent.getContent(this.content)
        .subscribe((data: string) => this.htmlContent = data);
  }

  onMenuTabSelect(tab: string): void {
    if (this.selectedMenu == tab) {
      this.selectedMenu = "";
    } else {
      this.selectedMenu = tab;
    }
  }

  onMenuSelect(action: string): void {
    this.menuChoice.emit(action);
    this.selectedMenu = "";
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
    this.renderer.setStyle(this.outline.nativeElement, 'width', width + 'px');
    this.renderer.setStyle(this.outline.nativeElement, 'height', height + 'px');

    // Register event handlers
    document.onmouseup = this.createMouseUp(this);
    document.onmousemove = this.createMouseMove(this);
  }

  moveTouchStart(event: TouchEvent): void {
    if (!this.draggable) {
      return;
    }

    event = event || window.event;
    event.preventDefault();

    let touch = event.touches.item(0);

    if (touch === null) {
      console.error('No touching!');
      return;
    }

    this.offsetX = this.posX;
    this.offsetY = this.posY;
    this.startX = touch.clientX;
    this.startY = touch.clientY;

    // Update dimensions and unhide outline box
    let width = this.window.nativeElement.clientWidth;
    let height = this.window.nativeElement.clientHeight;
    this.renderer.setStyle(this.outline.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.outline.nativeElement, 'width', width + 'px');
    this.renderer.setStyle(this.outline.nativeElement, 'height', height + 'px');

    // Register event handlers
    document.ontouchend = this.createTouchEnd(this);
    document.ontouchmove = this.createTouchMove(this);
  }

  createMouseUp(comp: WindowComponent): Nullable<Handler<MouseEvent>> {
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

  createTouchEnd(comp: WindowComponent): Nullable<Handler<TouchEvent>> {
    return function(_event: TouchEvent): void {
      // Deregister event handlers
      document.ontouchstart = null;
      document.ontouchend = null;

      // Hide outline box
      comp.renderer.setStyle(comp.outline.nativeElement, 'display', 'none');

      // Draw window at new position
      comp.renderer.setStyle(comp.window.nativeElement, 'top', comp.posY + 'px');
      comp.renderer.setStyle(comp.window.nativeElement, 'left', comp.posX + 'px');
    }
  }

  createMouseMove(comp: WindowComponent): Nullable<Handler<MouseEvent>> {
    return function(event: MouseEvent) {
      event = event || window.event;
      event.preventDefault();

      comp.posX = comp.offsetX + event.clientX - comp.startX;
      comp.posY = comp.offsetY + event.clientY - comp.startY;

      comp.renderer.setStyle(comp.outline.nativeElement, 'top', comp.posY + 'px');
      comp.renderer.setStyle(comp.outline.nativeElement, 'left', comp.posX + 'px');
    }
  }

  createTouchMove(comp: WindowComponent): Nullable<Handler<TouchEvent>> {
    return function(event: TouchEvent) {
      event = event || window.event;
      event.preventDefault();

      let touch = event.touches.item(0);

      if (touch === null) {
        console.error('No touching!');
        return;
      }

      comp.posX = comp.offsetX + touch.clientX - comp.startX;
      comp.posY = comp.offsetY + touch.clientY - comp.startY;

      comp.renderer.setStyle(comp.outline.nativeElement, 'top', comp.posY + 'px');
      comp.renderer.setStyle(comp.outline.nativeElement, 'left', comp.posX + 'px');
    }
  }

  createResizeMouseUp(comp: WindowComponent): Nullable<Handler<MouseEvent>> {
    return function(_event: MouseEvent): void {
      // Deregister event handlers
      document.onmouseup = null;
      document.onmousemove = null;

      // Draw window with new dimensions
      let width = comp.outline.nativeElement.clientWidth;
      let height = comp.outline.nativeElement.clientHeight;
      comp.renderer.setStyle(comp.window.nativeElement, 'width', width + 'px');
      comp.renderer.setStyle(comp.window.nativeElement, 'height', height + 'px');
      comp.renderer.setStyle(comp.window.nativeElement, 'top', comp.posY + 'px');
      comp.renderer.setStyle(comp.window.nativeElement, 'left', comp.posX + 'px');

      // Hide outline box
      comp.renderer.setStyle(comp.outline.nativeElement, 'display', 'none');
    }
  }

  createResizeTouchEnd(comp: WindowComponent): Nullable<Handler<TouchEvent>> {
    return function(_event: TouchEvent): void {
      // Deregister event handlers
      document.ontouchend = null;
      document.ontouchmove = null;

      // Draw window with new dimensions
      let width = comp.outline.nativeElement.clientWidth;
      let height = comp.outline.nativeElement.clientHeight;
      comp.renderer.setStyle(comp.window.nativeElement, 'width', width + 'px');
      comp.renderer.setStyle(comp.window.nativeElement, 'height', height + 'px');
      comp.renderer.setStyle(comp.window.nativeElement, 'top', comp.posY + 'px');
      comp.renderer.setStyle(comp.window.nativeElement, 'left', comp.posX + 'px');

      // Hide outline box
      comp.renderer.setStyle(comp.outline.nativeElement, 'display', 'none');
    }
  }

  createResizeMouseMove(comp: WindowComponent, direction: string): Nullable<Handler<MouseEvent>> {
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

  createResizeTouchMove(comp: WindowComponent, direction: string): (event: TouchEvent) => void {
    return function(event: TouchEvent) {
      event = event || window.event;
      event.preventDefault();

      let touch = event.touches.item(0);

      if (touch === null) {
        console.error('No touching!')
        return;
      }

      if (direction.startsWith('bottom')) {
        comp.newH = comp.startH + touch.clientY - comp.startY;
        comp.renderer.setStyle(comp.outline.nativeElement, 'height', comp.newH + 'px');
      } else if (direction.startsWith('top')) {
        comp.newH = comp.startH - touch.clientY + comp.startY;
        comp.posY = comp.offsetY + touch.clientY - comp.startY;
        comp.renderer.setStyle(comp.outline.nativeElement, 'height', comp.newH + 'px');
        comp.renderer.setStyle(comp.outline.nativeElement, 'top', comp.posY + 'px');
      }

      if (direction.endsWith('left')) {
        comp.newW = comp.startW - touch.clientX + comp.startX;
        comp.posX = comp.offsetX + touch.clientX - comp.startX;
        comp.renderer.setStyle(comp.outline.nativeElement, 'width', comp.newW + 'px');
        comp.renderer.setStyle(comp.outline.nativeElement, 'left', comp.posX + 'px');
      } else if (direction.endsWith('right')) {
        comp.newW = comp.startW + touch.clientX - comp.startX;
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
    this.renderer.setStyle(this.outline.nativeElement, 'width', width + 'px');
    this.renderer.setStyle(this.outline.nativeElement, 'height', height + 'px');

    // Register event handlers
    document.onmouseup = this.createResizeMouseUp(this);
    document.onmousemove = this.createResizeMouseMove(this, direction);
  }

  resizeTouchStart(event: TouchEvent, direction: string): void {
    if (!this.resizable) {
      return;
    }

    event = event || window.event;
    event.preventDefault();

    let touch = event.touches.item(0);

    if (touch === null) {
      console.error('No touching!');
      return;
    }

    this.offsetX = this.posX;
    this.offsetY = this.posY;
    this.startX = touch.clientX;
    this.startY = touch.clientY;

    // Update dimensions and unhide outline box
    let width = this.window.nativeElement.clientWidth;
    let height = this.window.nativeElement.clientHeight;
    this.startW = width;
    this.startH = height;
    this.renderer.setStyle(this.outline.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.outline.nativeElement, 'width', width + 'px');
    this.renderer.setStyle(this.outline.nativeElement, 'height', height + 'px');

    // Register event handlers
    document.ontouchend = this.createResizeTouchEnd(this);
    document.ontouchmove = this.createResizeTouchMove(this, direction);
  }
}

