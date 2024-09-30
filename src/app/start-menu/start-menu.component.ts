import { HttpClient } from '@angular/common/http';
import { ProgramService } from '../program.service';
import { Component, HostListener, Input, Output, EventEmitter } from '@angular/core';

interface IconDescription {
    x: number;
    y: number;
    source: string;
}

interface Icon {
    id: number;
    x: number;
    y: number;
    image: string;
    title: string;
    selected: boolean;
    source: string;
}

@Component({
  selector: 'app-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrls: ['./start-menu.component.scss']
})
export class StartMenuComponent {
  currentId = 0;
  contextMenuOpen = false;

  @Input() icons: Icon[] = [];
  @Output() shortcutAction = new EventEmitter<string>();

  constructor(private http: HttpClient, private programService: ProgramService) {
    this.http.get("/assets/desktop.json").subscribe(resp => {
        let desktop = resp as IconDescription[];

        desktop.forEach(icon => {
            this.programService.loadProgram(icon.source).subscribe(program => {
                this.icons.push({
                    "id": this.getId(),
                    "x": icon.x,
                    "y": icon.y,
                    "image": program.desktop.icon,
                    "title": program.desktop.title,
                    "selected": false,
                    "source": icon.source,
                });
            });
        });
    });
  }

  getId(): number {
    return this.currentId++;
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
    this.contextMenuOpen = false;
  }

  launch(id: number): void {
    let icon = this.getIconById(id);
    this.shortcutAction.emit(icon.source);
    this.select(-1);
  }
}
