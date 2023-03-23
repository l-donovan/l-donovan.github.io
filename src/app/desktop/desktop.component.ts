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

  @Input() windows = [];
  @Input() icons = [
    {
      "id": this.getId(),
      "x": 10,
      "y": 10,
      "title": "My Computer",
      "image": "/assets/img/my_computer.ico",
      "content": "trek",
      "selected": false,
    },
    {
      "id": this.getId(),
      "x": 10,
      "y": 120,
      "title": "Recycle Bin",
      "image": "/assets/img/recycle_bin_empty.ico",
      "content": "welcome",
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
    this.shortcutAction.emit(icon.content);
    this.select(-1);
  }
}
