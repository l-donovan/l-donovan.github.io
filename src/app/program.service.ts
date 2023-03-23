import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Program } from './common';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  programMap = new Map<string, Program>();

  constructor(private http: HttpClient) { }

  loadProgram(programName: string): Observable<Program> {
    let program = this.programMap.get(programName);

    if (program !== undefined) {
        return of(program);
    }

    return this.http.get(`/assets/program/${programName}.json`).pipe(map(resp => {
        let program = resp as Program;
        this.programMap.set(programName, program);
        return program;
    }));
  }
}
