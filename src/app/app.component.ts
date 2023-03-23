import { Component } from '@angular/core';
import { ProgramService } from './program.service';

interface WindowDescription {
    id: number;
    icon: string;
    title: string;
    content: string;
    minimized: boolean;
    menus: any[];
}

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

  windows: WindowDescription[] = [];

  constructor(private programService: ProgramService) {
  }

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

  handleShortcutAction(source: string): void {
    this.programService.loadProgram(source).subscribe(program => {
        this.windows.push({
            "id": this.getId(),
            "icon": program.window.icon,
            "title": program.window.title,
            "content": program.window.content,
            "menus": [
                {
                "name": "File",
                "items": []
                }
            ],
            "minimized": false,
        });
    });
  }

  handleMenuChoice(id: number, action: string): void {
    
  }
}
