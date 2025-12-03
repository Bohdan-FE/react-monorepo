type CircleOptions = {
  percentage: number;
  color?: string; // для прогресс-дуги
  fillColor?: string; // новый: фон круга
  radius: number;
  lineWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  gradientColorStart?: string;
  gradientColorEnd?: string;
  imageUrl?: string;
  mass?: number;
};

export class CircleDrawer {
  private ctx: CanvasRenderingContext2D;
  private percentage: number;
  private color?: string;
  private fillColor?: string; // фон
  public radius: number;
  private lineWidth?: number;
  private shadowColor?: string;
  private shadowBlur?: number;
  public x: number;
  public y: number;
  private gradientColorStart?: string;
  private gradientColorEnd?: string;
  private imageUrl?: string;
  private image?: HTMLImageElement;
  public vx: number = 0;
  public vy: number = 0;
  public mass: number;
  public angle: number = 0;
  public angularVelocity: number = 0;
  public inertia: number = 0;

  constructor(ctx: CanvasRenderingContext2D, options: CircleOptions) {
    this.ctx = ctx;
    this.percentage = options.percentage;
    this.color = options.color;
    this.fillColor = options.fillColor;
    this.radius = options.radius;
    this.lineWidth = options.lineWidth;
    this.shadowColor = options.shadowColor;
    this.shadowBlur = options.shadowBlur;
    this.x = options.x;
    this.y = options.y;
    this.gradientColorStart = options.gradientColorStart;
    this.gradientColorEnd = options.gradientColorEnd;
    this.imageUrl = options.imageUrl;
    this.mass = options.mass ?? 1;

    if (this.imageUrl) {
      this.loadImage(this.imageUrl);
    }
  }

  update(options: Partial<CircleOptions>) {
    Object.assign(this, options);

    if (options.imageUrl) {
      this.loadImage(options.imageUrl);
    }
  }

  private loadImage(url: string) {
    this.image = new Image();
    this.image.src = url;
  }

  draw() {
    const ctx = this.ctx;
    const startAngle = Math.PI * 0.5;
    const sweepAngle = this.percentage * Math.PI * 2;
    const endAngle = startAngle + sweepAngle;

    ctx.save();

    // Переносим центр в позицию круга
    ctx.translate(this.x, this.y);

    // Вращаем контекст на угол this.Angle
    ctx.rotate(this.Angle || 0);

    // --- Fill circle background ---
    if (this.fillColor) {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    }

    // --- Draw image inside circle ---
    if (this.image) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.clip();

      const img = this.image;
      const circleSize = this.radius * 2;

      // COVER вместо contain
      const scale = Math.max(circleSize / img.width, circleSize / img.height);

      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;

      const dx = -drawWidth / 2;
      const dy = -drawHeight / 2;

      ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
      ctx.restore();
    }

    // --- Draw progress arc ---
    const gradient = ctx.createLinearGradient(
      -this.radius,
      -this.radius,
      this.radius,
      this.radius
    );
    gradient.addColorStop(0, this.gradientColorStart || this.color || 'white');
    gradient.addColorStop(1, this.gradientColorEnd || this.color || 'white');

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, startAngle, endAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = this.lineWidth || 1;
    ctx.shadowColor = this.shadowColor || '';
    ctx.shadowBlur = this.shadowBlur || 0;
    ctx.stroke();

    ctx.restore();
  }

  set X(x: number) {
    this.x = x;
  }
  set Y(y: number) {
    this.y = y;
  }
  get X() {
    return this.x;
  }
  get Y() {
    return this.y;
  }
  get VX() {
    return this.vx;
  }
  get VY() {
    return this.vy;
  }
  set VX(vx: number) {
    this.vx = vx;
  }
  set VY(vy: number) {
    this.vy = vy;
  }
  get Radius() {
    return this.radius;
  }
  get Mass() {
    return this.mass;
  }

  get Angle() {
    return this.angle;
  }

  set Angle(angle: number) {
    this.angle = angle;
  }

  get AngularVelocity() {
    return this.angularVelocity;
  }

  set AngularVelocity(angularVelocity: number) {
    this.angularVelocity = angularVelocity;
  }

  get Inertia() {
    return this.inertia;
  }

  set Inertia(inertia: number) {
    this.inertia = inertia;
  }
}
