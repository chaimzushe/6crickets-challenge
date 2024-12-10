
const canCoverRange = (
  desiredDistanceMin: number,
  desiredDistanceMax: number,
  desiredLightMin: number,
  desiredLightMax: number,
  cameras: any[]
) => {
  
  const potentialCameras = cameras.filter(
    (camera) =>
      camera.distanceMax >= desiredDistanceMin &&
      camera.distanceMin <= desiredDistanceMax &&
      camera.lightMax >= desiredLightMin &&
      camera.lightMin <= desiredLightMax
  );

  if (potentialCameras.length === 0) return false;
  let distanceEndpoints: number[] = [];
  potentialCameras.forEach((camera) => {
    const start = Math.max(camera.distanceMin, desiredDistanceMin);
    const end = Math.min(camera.distanceMax, desiredDistanceMax);
    if (start <= end) distanceEndpoints.push(start, end);
    
  });

  distanceEndpoints.push(desiredDistanceMin, desiredDistanceMax);
  distanceEndpoints = Array.from(new Set(distanceEndpoints)).sort(
    (a, b) => a - b
  );


  for (let i = 0; i < distanceEndpoints.length - 1; i++) {
    const dStart = distanceEndpoints[i];
    const dEnd = distanceEndpoints[i + 1];
    if (dEnd <= dStart) continue;
    const coveringCameras = potentialCameras.filter(
      (cam) => cam.distanceMax >= dStart && cam.distanceMin <= dEnd
    );
    if (!isLightFullyCovered(desiredLightMin, desiredLightMax, coveringCameras)) return false;
  }
  return true;
}

function isLightFullyCovered(
  lightMin: number,
  lightMax: number,
  cameras: any[]
): boolean {
  const lightIntervals = cameras
    .map((cam) => {
      return {
        start: Math.max(cam.lightMin, lightMin),
        end: Math.min(cam.lightMax, lightMax),
      };
    })
    .filter((interval) => interval.end >= interval.start);

  if (lightIntervals.length === 0) return false;
  
  lightIntervals.sort((a, b) => a.start - b.start);

  let currentEnd = lightIntervals[0].end;
  if (lightIntervals[0].start > lightMin) return false;

  for (let i = 1; i < lightIntervals.length; i++) {
    if (lightIntervals[i].start > currentEnd) return false;
    if (lightIntervals[i].end > currentEnd) currentEnd = lightIntervals[i].end;
    if (currentEnd >= lightMax)  return true;
  }

  return currentEnd >= lightMax;
}

