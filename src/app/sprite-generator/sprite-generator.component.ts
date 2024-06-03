import { Component, OnInit } from '@angular/core';
import { AirlineCodesService } from '../airline-codes.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-sprite-generator',
  templateUrl: './sprite-generator.component.html',
  styleUrls: ['./sprite-generator.component.css']
})
export class SpriteGeneratorComponent implements OnInit {

  files: File[] = [];
  comparableAirlineCodeName: any[] = [];
  spriteSheetUrl: string | null = null;
  metadata: any[] = [];

  readonly AirlineCodes = '../../assets/json/airlineCodes.json';

  columns: number = 15;  // Number of columns in the sprite sheet
  public airlineCodes: any;
  constructor(public airlineCodesService: AirlineCodesService, public http: HttpClient) {
    console.log('this.AirlineCodes ', this.airlineCodesService)
  }

  public ngOnInit(): void {


    this.getCodes()
      .subscribe((data) => {
        this.airlineCodes = JSON.parse(data)
        // console.log('this.airlineCodes ', this.airlineCodes)
        this.sortAirlineDescriptions()
      })
  }

  public sortAirlineDescriptions(): void {
    //console.log('this.airlineCodes ', this.airlineCodes)
    this.airlineCodes.sort((a: any, b: any) => a.Description.localeCompare(b.Description));
  }

  public getCodes(): Observable<string> {
    return this.http.get(this.AirlineCodes, { responseType: 'text' });
  }


  onFileSelected(event: any): void {
    this.files = Array.from(event.target.files);

    //console.log('event.target.files', event.target.files);

    this.comparableAirlineCodeName = this.files.map(file => {
      let fileName = file.name;
      fileName = fileName.replace('.svg', ''); // remove .svg
      fileName = fileName.trim(); // remove leading and trailing spaces
      // console.log('this.files......... ', { ...file, name: fileName });
      return { ...file, name: fileName }; // return new file object with updated name
    });

    // console.log('this.files comparableAirlineCodeName ', this.comparableAirlineCodeName);

  }


  public findCodes(): any {

    let matches = this.airlineCodes.filter((code: any, i: number) => {
      return this.comparableAirlineCodeName.some(comparable => {
        return comparable.name === code.Description
      })

    });
    console.log('matches', matches)
  }



  public async generateSpriteSheet(): Promise<void> {
    if (this.files.length === 0) {
      alert('Please select some SVG files');
      return;
    }

    const parser = new DOMParser();
    const svgs = await Promise.all(this.files.map(async file => {
      const svgText = await this.readFileAsText(file);
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = doc.documentElement;
      let width = parseInt(svgElement.getAttribute('width') || '100', 10);
      let height = parseInt(svgElement.getAttribute('height') || '100', 10);
      width = width / 3;
      height = height / 3;
      return { svg: svgText, width, height };
    }));

    const canvas = document.createElement('canvas');
    const maxSpriteWidth = Math.max(...svgs.map(({ width }) => width));
    const maxSpriteHeight = Math.max(...svgs.map(({ height }) => height));
    const numRows = Math.ceil(svgs.length / this.columns);
    canvas.width = maxSpriteWidth * this.columns;
    canvas.height = maxSpriteHeight * numRows;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.metadata = [];

    await Promise.all(svgs.map(({ svg, width, height }, index) => this.drawSvgToCanvas(ctx, svg, index, width, height)));

    this.spriteSheetUrl = canvas.toDataURL('image/png');

    this.generateMetadataFile();
  }




  private readFileAsText(file: File): Promise<string> {

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }


  private drawSvgToCanvas(ctx: CanvasRenderingContext2D | null, svg: string, index: number, width: number, height: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const col = index % this.columns;
        const row = Math.floor(index / this.columns);
        const x = col * width;
        const y = row * height;
        ctx?.drawImage(img, x, y, width, height);
        if (!ctx) {
          throw new Error('Failed to get 2D context');
        }
        ctx.strokeStyle = 'black'; // Set the color of the border
        ctx.lineWidth = 1; // Set the width of the border
        ctx.strokeRect(x, y, width, height); // Draw the borderr

        this.metadata.push({
          name: this.files[index].name,
          x,
          y,
          width,
          height
        });

        resolve();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svg);
    });
  }

  private drawSvgToCanvas2(ctx: CanvasRenderingContext2D | null, svg: string, index: number, size: number): Promise<void> {
    console.log('drawSvgToCanvas', size)
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const col = index % this.columns;
        const row = Math.floor(index / this.columns);
        const x = col * size;
        const y = row * size;
        const width = size;
        const height = size;
        console.log('width ', width)
        ctx?.drawImage(img, x, y, width, height);

        this.metadata.push({
          name: this.files[index].name,
          x,
          y,
          width,
          height
        });

        resolve();
      };
      img.onerror = reject;
      img.src = `data:image/svg+xml;base64,${btoa(svg)}`;
    });
  }

  private generateMetadataFile(): void {
    const metadataBlob = new Blob([JSON.stringify(this.metadata, null, 2)], { type: 'application/json' });
    console.log('metadataBlob ', metadataBlob)
    const metadataUrl = URL.createObjectURL(metadataBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = metadataUrl;
    downloadLink.download = 'sprite-sheet-metadata.json';
    downloadLink.textContent = 'Download Metadata';

    console.log('downloadLink ', this.metadata)
    this.findCodes();
    const output = document.getElementById('output');
    if (output) {
      output.appendChild(downloadLink);
    }
  }
}
