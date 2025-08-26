type CircleOptions = {
  percentage: number;
  color?: string;
  radius: number;
  lineWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  x: number;
  y: number;
  gradientColorStart?: string;
  gradientColorEnd?: string;
};

export class CircleDrawer {
  private ctx: CanvasRenderingContext2D;
  private percentage: number;
  private color?: string;
  private radius: number;
  private lineWidth?: number;
  private shadowColor?: string;
  private shadowBlur?: number;
  private x: number;
  private y: number;
  private gradientColorStart?: string;
  private gradientColorEnd?: string;
  constructor(
    ctx: CanvasRenderingContext2D,
    options: {
      percentage: number;
      color?: string;
      radius: number;
      lineWidth?: number;
      shadowColor?: string;
      shadowBlur?: number;
      x: number;
      y: number;
      gradientColorStart?: string;
      gradientColorEnd?: string;
    }
  ) {
    this.ctx = ctx;
    this.percentage = options.percentage;
    this.color = options.color;
    this.radius = options.radius;
    this.lineWidth = options.lineWidth;
    this.shadowColor = options.shadowColor;
    this.shadowBlur = options.shadowBlur;
    this.x = options.x;
    this.y = options.y;
    this.gradientColorStart = options.gradientColorStart;
    this.gradientColorEnd = options.gradientColorEnd;
  }
  update(options: Partial<CircleOptions>) {
    Object.assign(this, options);
  }
  draw() {
    const startAngle = Math.PI * 2 * 0.25;
    const sweepAngle = this.percentage * Math.PI * 2;
    const endAngle = startAngle + sweepAngle;
    this.ctx.save();
    const gradient = this.ctx.createLinearGradient(
      this.x - this.radius,
      this.y - this.radius,
      this.x + this.radius,
      this.y + this.radius
    );
    gradient.addColorStop(0, this.gradientColorStart || this.color || 'white');
    gradient.addColorStop(1, this.gradientColorEnd || this.color || 'white');
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, startAngle, endAngle);
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = this.lineWidth || 1;
    this.ctx.shadowColor = this.shadowColor || '';
    this.ctx.shadowBlur = this.shadowBlur || 0;
    this.ctx.stroke();
    this.ctx.restore();
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getRadius() {
    return this.radius;
  }
}
