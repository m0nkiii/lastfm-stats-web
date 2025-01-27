import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Export, Progress } from '../model';
import { ProgressService } from '../service/progress.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressComponent {
  constructor(private service: ProgressService) {
  }

  get progress(): Progress {
    return this.service.progress;
  }

  get percentage(): number {
    return (this.currentPage / this.totalPages) * 100;
  }

  get currentPage(): number {
    return this.totalPages - this.progress.currentPage;
  }

  get totalPages(): number {
    return this.progress.totalPages;
  }

  get eta(): string {
    const timeInSeconds = (this.progress.pageLoadTime || 3000) * this.progress.currentPage / 1000;
    return `~ ${Math.ceil(timeInSeconds / 60)} minutes`;
  }

  exportJSON(): void {
    const data: Export = {
      username: this.progress.user!.name,
      scrobbles: this.progress.allScrobbles.map(s => ({track: s.track, artist: s.artist, album: s.album, date: s.date.getTime()}))
    };
    this.export(new Blob([JSON.stringify(data)], {type: 'application/json;charset=utf-8;'}), 'json');
  }

  exportCSV(): void {
    const hasAlbums = this.progress.allScrobbles.some(r => r.album);
    const headers = `Artist;${hasAlbums ? 'Album;' : ''}Track;Date#${this.progress.user!.name}\n`;
    const data = this.progress.allScrobbles.map(s =>
      this.csvEntry(s.artist) +
      (hasAlbums ? this.csvEntry(s.album || '') : '') +
      this.csvEntry(s.track) +
      `"${s.date.getTime()}"`).join('\n');
    this.export(new Blob(['\ufeff' + headers + data], {type: 'text/csv;charset=utf-8;'}), 'csv');
  }

  private csvEntry(input: string): string {
    return `"${input.replaceAll('"', '""')}";`;
  }

  private export(blob: Blob, ext: string): void {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `lastfmstats-${this.progress.user!.name}.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
