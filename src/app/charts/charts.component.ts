import {Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {filter} from 'rxjs/operators';
import {StatsBuilderService, TempStats} from '../stats-builder.service';
import {AbstractChart} from './abstract-chart';
import {TimelineChart} from './timeline-chart';
import {ArtistScrobbleChart} from './artist-scrobble-chart';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  charts: AbstractChart[] = [new TimelineChart(), new ArtistScrobbleChart()];

  constructor(private builder: StatsBuilderService) {
  }

  ngOnInit(): void {
    this.builder.tempStats.pipe(filter(s => !!s.last)).subscribe(stats => this.updateStats(stats));
  }

  private updateStats(stats: TempStats): void {
    this.charts.forEach(c => c.update(stats));
  }
}
