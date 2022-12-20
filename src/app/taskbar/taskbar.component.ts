import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.scss']
})
export class TaskbarComponent implements OnInit {
  currentId = 0;

  getId(): number {
    return this.currentId++;
  }

  @Input() tabs = [
    {
      "id": this.getId(),
      "title": "paint",
      "minimized": false,
    },
    {
      "id": this.getId(),
      "title": "test",
      "minimized": true,
    },
  ];

  selectedTabs: Array<number> = [];
  menuOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  menuClicked(): void {
    this.menuOpen = !this.menuOpen;
  }

  getTabById(id: number) {
    return this.tabs.find(tab => tab.id == id)!;
  }

  tabClicked(id: number): void {
    let tab = this.getTabById(id);
    tab.minimized = !tab.minimized;
  }
}
