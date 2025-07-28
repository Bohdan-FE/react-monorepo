export type ClipPathParams = {
  element?: HTMLElement;
  width?: number;
  height?: number;
  radius?: number;
  leftTopXPercentage?: number;
  leftTopYPercentage?: number;
  rightTopXPercentage?: number;
  rightTopYPercentage?: number;
  rightBottomXPercentage?: number;
  rightBottomYPercentage?: number;
  leftBottomXPercentage?: number;
  leftBottomYPercentage?: number;
};

export function getClipPath(params: ClipPathParams) {
  const {
    element,
    width: widthArg,
    height: heightArg,
    radius: radiusIndex = 45,
    leftBottomXPercentage = 0,
    leftBottomYPercentage = 0,
    leftTopXPercentage = 0,
    leftTopYPercentage = 0,
    rightBottomXPercentage = 0,
    rightBottomYPercentage = 0,
    rightTopXPercentage = 0,
    rightTopYPercentage = 0,
  } = params;

  const multiplier = 2;

  // Determine actual width and height
  const width = element?.clientWidth || widthArg;
  const height = element?.clientHeight || heightArg;

  const aspectRatio = width && height ? width / height : 0;

  if (!width || !height) {
    return '';
  }

  // Convert percentage inputs into absolute values
  const leftTopX = (leftTopXPercentage / 100) * width;
  const leftTopY = (leftTopYPercentage / 100) * height;
  const rightTopX = (rightTopXPercentage / 100) * width;
  const rightTopY = (rightTopYPercentage / 100) * height;
  const rightBottomX = (rightBottomXPercentage / 100) * width;
  const rightBottomY = (rightBottomYPercentage / 100) * height;
  const leftBottomX = (leftBottomXPercentage / 100) * width;
  const leftBottomY = (leftBottomYPercentage / 100) * height;

  // Calculate radius values
  const rightTopXRadiusIndex = (rightTopXPercentage / 100) * radiusIndex;
  const rightTopYRadiusIndex = (rightTopYPercentage / 100) * radiusIndex;
  const rightBottomYRadiusIndex = (rightBottomYPercentage / 100) * radiusIndex;
  const rightBottomXRadiusIndex = (rightBottomXPercentage / 100) * radiusIndex;
  const leftBottomXRadiusIndex = (leftBottomXPercentage / 100) * radiusIndex;
  const leftBottomYRadiusIndex = (leftBottomYPercentage / 100) * radiusIndex;
  const leftTopXRadiusIndex = (leftTopXPercentage / 100) * radiusIndex;
  const leftTopYRadiusIndex = (leftTopYPercentage / 100) * radiusIndex;

  // Construct the SVG path
  const path = `M ${
    leftBottomX -
    leftBottomXRadiusIndex * aspectRatio +
    leftTopXRadiusIndex * aspectRatio
  } ${height - radiusIndex - leftBottomY} L ${
    leftTopX +
    leftBottomXRadiusIndex * aspectRatio -
    leftTopXRadiusIndex * aspectRatio
  } ${
    radiusIndex + leftTopY - (leftTopYRadiusIndex * multiplier) / aspectRatio
  } Q ${leftTopX} ${leftTopY} ${
    radiusIndex + leftTopX - leftTopXRadiusIndex * multiplier
  } ${
    leftTopY +
    rightTopYRadiusIndex / aspectRatio -
    leftTopYRadiusIndex / aspectRatio
  } L ${width - radiusIndex - rightTopX + rightTopXRadiusIndex * multiplier} ${
    rightTopY -
    rightTopYRadiusIndex / aspectRatio +
    leftTopYRadiusIndex / aspectRatio
  } Q ${width - rightTopX} ${rightTopY} ${
    width -
    rightTopX +
    rightTopXRadiusIndex * aspectRatio -
    rightBottomXRadiusIndex * aspectRatio
  } ${
    radiusIndex + rightTopY - (rightTopYRadiusIndex * multiplier) / aspectRatio
  } L ${
    width -
    rightBottomX -
    rightTopXRadiusIndex * aspectRatio +
    rightBottomXRadiusIndex * aspectRatio
  } ${
    height -
    radiusIndex -
    rightBottomY +
    (rightBottomYRadiusIndex * multiplier) / aspectRatio
  } Q ${width - rightBottomX} ${height - rightBottomY} ${
    width - radiusIndex - rightBottomX + rightBottomXRadiusIndex * multiplier
  } ${
    height -
    rightBottomY +
    rightBottomYRadiusIndex / aspectRatio -
    leftBottomYRadiusIndex / aspectRatio
  } L ${radiusIndex + leftBottomX - leftBottomXRadiusIndex * multiplier} ${
    height -
    leftBottomY -
    rightBottomYRadiusIndex / aspectRatio +
    leftBottomYRadiusIndex / aspectRatio
  } Q ${leftBottomX} ${height - leftBottomY} ${
    leftBottomX -
    leftBottomXRadiusIndex * aspectRatio +
    leftTopXRadiusIndex * aspectRatio
  } ${
    height -
    radiusIndex -
    leftBottomY +
    (rightBottomYRadiusIndex * multiplier) / aspectRatio
  } Z
    `;

  return `path("${path.trim()}")`;
}
