import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {
  currentId = 0;

  getId(): number {
    return this.currentId++;
  }

  @Input() icons = [
    {
      "id": this.getId(),
      "x": 100,
      "y": 0,
      "title": "Test",
      "image": "/assets/img/computer.ico",
      "action": "",
      "selected": false,
    }
  ];

  @Output() shortcutAction = new EventEmitter<string>();

  constructor() { }
  ngOnInit(): void { }

  range(a: number, b: number | null = null): Array<number> {
    let start: number;
    let end: number;

    if (b !== null) {
      start = a;
      end = b;
    } else {
      start = 0;
      end = a;
    }

    return [...Array(1 + end - start).keys()].map(v => start + v);
  }

  getIconById(id: number) {
    return this.icons.find(icon => icon.id == id)!;
  }

  select(id: number, event: MouseEvent | null = null): void {
    if (event !== null) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }

    this.icons.forEach(icon => icon.selected = icon.id == id);
  }

  launch(id: number): void {
    let icon = this.getIconById(id);
    this.shortcutAction.emit(icon.action);
    this.select(-1);
  }
}
