// Kaaba coordinates in degrees
const KAABA_LAT = 21.3891;
const KAABA_LNG = 39.8579;

export function getQiblaDirection(latitude: number, longitude: number): number {
  // Convert degrees to radians
  const phiK = (KAABA_LAT * Math.PI) / 180.0;
  const lambdaK = (KAABA_LNG * Math.PI) / 180.0;
  const phi = (latitude * Math.PI) / 180.0;
  const lambda = (longitude * Math.PI) / 180.0;

  // Calculate the bearing
  const psi =
    (180.0 / Math.PI) *
    Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) -
        Math.sin(phi) * Math.cos(lambdaK - lambda)
    );

  // Normalize to 0-360 degrees
  return (psi + 360.0) % 360.0;
}

// Helper function to convert degrees to cardinal direction
export function degreesToCardinal(degrees: number): string {
  const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return cardinals[index];
}