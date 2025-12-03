function AnimatedDecor() {
  const distance = 21;

  const translateByDistance = (angle: number, distance: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radians) * distance,
      y: Math.sin(radians) * distance,
    };
  };

  return (
    <div className="absolute top-1/2 left-1/2 translate-[-50%] size-24 animate-spin-slow opacity-70">
      <div
        className="absolute inset-0 m-auto size-24 "
        style={{
          transform: `translate(${
            translateByDistance((360 / 6) * 1, distance).x
          }rem, ${translateByDistance((360 / 6) * 1, distance).y}rem)`,
        }}
      >
        <img
          className="size-full object-contain object-center animate-spin"
          src="/shuriken2.png"
          alt=""
        />
      </div>
      <div
        className="absolute inset-0 m-auto size-24"
        style={{
          transform: `translate(${
            translateByDistance((360 / 6) * 2, distance).x
          }rem, ${translateByDistance((360 / 6) * 2, distance).y}rem)`,
        }}
      >
        <img
          className="size-full object-contain object-center animate-spin"
          src="/suriken.png"
          alt=""
        />
      </div>

      <div
        className="absolute inset-0 m-auto size-24"
        style={{
          transform: `translate(${
            translateByDistance((360 / 6) * 3, distance).x
          }rem, ${translateByDistance((360 / 6) * 3, distance).y}rem)`,
        }}
      >
        <img
          className="size-full object-contain object-center animate-spin "
          src="/fan.png"
          alt=""
        />
      </div>

      <div
        className="absolute inset-0 m-auto size-24"
        style={{
          transform: `translate(${
            translateByDistance((360 / 6) * 4, distance).x
          }rem, ${translateByDistance((360 / 6) * 4, distance).y}rem)`,
        }}
      >
        <img
          className="size-full object-contain object-center animate-spin"
          src="/shuriken2.png"
          alt=""
        />
      </div>

      <div
        className="absolute inset-0 m-auto size-24"
        style={{
          transform: `translate(${
            translateByDistance((360 / 6) * 5, distance).x
          }rem, ${translateByDistance((360 / 6) * 5, distance).y}rem)`,
        }}
      >
        <img
          className="size-full object-contain object-center animate-spin"
          src="/suriken.png"
          alt=""
        />
      </div>
      <div
        className="absolute inset-0 m-auto size-24"
        style={{
          transform: `translate(${
            translateByDistance((360 / 6) * 6, distance).x
          }rem, ${translateByDistance((360 / 6) * 6, distance).y}rem)`,
        }}
      >
        <img
          className="size-full object-contain object-center animate-spin"
          src="/fan.png"
          alt=""
        />
      </div>
    </div>
  );
}

export default AnimatedDecor;
