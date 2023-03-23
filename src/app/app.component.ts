import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'windows';

  currentId = 0;

  getId(): number {
    return this.currentId++;
  }

  windows = [
    {
      "id": this.getId(),
      "icon": "/assets/img/paint.ico",
      "title": "paint",
      "content": "dummy",
      "menus": [
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
      ],
      "minimized": false,
    }
  ];

  getWindowById(id: number) {
    return this.windows.find(win => win.id == id)!;
  }

  closeWindowById(id: number) {
    this.windows = this.windows.filter(win => win.id != id);
  }

  handleWindowAction(id: number, action: string): void {
    switch (action) {
    case "minimize":
      this.getWindowById(id).minimized = true;
      break;
    case "close":
      this.closeWindowById(id);
      break;
    default:
      break;
    }
  }

  handleShortcutAction(content: string): void {
    this.windows.push({
      "id": this.getId(),
      "icon": "/assets/img/notepad.ico",
      "title": "Star Trek!",
      "content": content,
      "menus": [
        {
          "name": "File",
          "items": []
        }
      ],
      "minimized": false,
    });
  }

  handleMenuChoice(id: number, action: string): void {
    
  }
}
