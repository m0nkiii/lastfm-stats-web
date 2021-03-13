import {TempStats} from '../stats-builder.service';
import {AbstractChart} from './abstract-chart';
import * as Highcharts from 'highcharts';

export class ArtistScrobbleChart extends AbstractChart {
  options: Highcharts.Options = {
    title: {text: 'Tracks per artist'},
    subtitle: {text: '(50+ scrobbles)'},
    chart: {
      type: 'scatter',
      zoomType: 'xy',
    },
    xAxis: {
      title: {
        text: 'Scrobbles'
      },
      min: 0
    },
    yAxis: {
      title: {
        text: 'Tracks'
      },
      min: 0
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      scatter: {
        tooltip: {
          headerFormat: '',
          pointFormat: '<span style="color:{point.color}">\u25CF</span>{point.name}<br>Scrobbles: {point.x}<br>Tracks: {point.y}',
        }
      }
    },
    series: [{
      name: 'Artists',
      type: 'scatter',
      data: []
    }]
  };

  update(stats: TempStats): void {
    if (!this.chart) {
      return;
    }

    const data = Object.values(stats.seenArtists).filter(a => a.scrobbleCount > 50).map(artist => ({
      x: artist.scrobbleCount,
      y: artist.tracks.length,
      name: artist.name
    }));

    this.chart.series[0].setData(data);
  }
}
