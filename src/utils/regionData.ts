/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import regionsData from '../data/regions.json';
import trendData from '../data/trend.json';
import firesData from '../data/fires.json';
import calendarData from '../data/calendar.json';
import validationData from '../data/validation.json';
import type { RegionId } from '../App';

export function getRegionMeta(regionId: RegionId) {
  return (
    regionsData.regions.find((r) => r.id === regionId) || regionsData.regions[0]
  );
}

export function getRegionFires(regionId: RegionId) {
  const byRegion = (firesData as any).byRegion || {};
  return byRegion[regionId] || firesData.fires || [];
}

/**
 * Returns the region's trend timeline.
 * If the region exists in trend.json, returns it directly.
 * If only event-level data is present in fires.json (e.g. malaysia),
 * aggregates annual cellDays and FRP from fires.json across the timeline years in trend.json.
 */
export function getRegionTrend(regionId: RegionId) {
  const byRegion = (trendData as any).byRegion || {};
  if (byRegion[regionId]) {
    return {
      ...byRegion[regionId],
      isEventDerived: false,
    };
  }

  const meta = getRegionMeta(regionId);
  const fires = getRegionFires(regionId);
  const baseYears = trendData.timeline.map((t) => ({
    year: t.year,
    sensor: t.sensor,
  }));

  const timeline = baseYears.map(({ year, sensor }) => {
    const yearFires = fires.filter((f: any) => f.year === year);
    const totalCellDays = yearFires.reduce(
      (sum: number, f: any) => sum + (f.cellDays || 0),
      0
    );
    const totalFrp = Math.round(
      yearFires.reduce((sum: number, f: any) => sum + (f.totalFrpMw || 0), 0)
    );
    return {
      year,
      raw: totalFrp,
      fixed: totalCellDays,
      sensor,
    };
  });

  return {
    region: regionId,
    regionName: meta.fullName || meta.name,
    unit: 'event_archive',
    timeline,
    isEventDerived: true,
  };
}

/**
 * Returns the region's daily calendar archive.
 * If the region exists in calendar.json, returns it directly.
 * Otherwise builds the year/day structure strictly from the loaded fires.json events for that region.
 */
export function getRegionCalendar(regionId: RegionId) {
  const byRegion = (calendarData as any).byRegion || {};
  if (byRegion[regionId]) {
    return byRegion[regionId];
  }

  const meta = getRegionMeta(regionId);
  const fires = getRegionFires(regionId);
  const templateYears = calendarData.years;

  const years = templateYears.map((tmplYear: any) => {
    const yr = tmplYear.year;
    const yearFires = fires.filter((f: any) => f.year === yr);

    let annualCount = 0;
    const days = tmplYear.days.map((tmplDay: any) => {
      const dayTime = new Date(tmplDay.date).getTime();
      let count = 0;
      yearFires.forEach((f: any) => {
        const start = new Date(f.startDate).getTime();
        const end = new Date(f.endDate).getTime();
        if (dayTime >= start && dayTime <= end) {
          count += f.cellDays || 0;
        }
      });
      annualCount += count;
      return {
        ...tmplDay,
        count,
      };
    });

    return {
      year: yr,
      sensor: tmplYear.sensor,
      annualCount,
      days,
    };
  });

  return {
    sample: false,
    region: meta.name,
    startYear: calendarData.startYear,
    endYear: calendarData.endYear,
    years,
  };
}

export function getRegionValidation(regionId: RegionId) {
  const byRegion = (validationData as any).byRegion || {};
  if (byRegion[regionId]) {
    return {
      ...byRegion[regionId],
      isPendingTrendValidation: false,
    };
  }

  return {
    jumpBeforeFix: validationData.burnedAreaStatus || 'Validation pending',
    jumpAfterFix: validationData.burnedAreaStatus || 'Validation pending',
    rawStep2012Pct: validationData.burnedAreaStatus || 'Validation pending',
    fixedStep2012Pct: validationData.burnedAreaStatus || 'Validation pending',
    burnedAreaMatchScore: null,
    burnedAreaStatus: validationData.burnedAreaStatus || 'Validation pending',
    isPendingTrendValidation: true,
  };
}
