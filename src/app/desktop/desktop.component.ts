import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProgramService } from '../program.service';

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
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {
  currentId = 0;

  getId(): number {
    return this.currentId++;
  }

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
    this.shortcutAction.emit(icon.source);
    this.select(-1);
  }
}
