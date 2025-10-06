function Fire({ color }: { color?: string }) {
  const amount = 100;
  const fireColor = color || 'rgb(255,80,0)';
  const fireColorT = color || 'rgba(255,80,0,0)';

  return (
    <div className="w-full  blur-[0.02em] relative">
      {Array.from({ length: amount }).map((_, index) => {
        const left = `calc((100%) * ${index / amount})`;
        return (
          <div
            className="w-[25%] aspect-square rounded-full absolute bottom-0"
            style={{
              backgroundImage: `radial-gradient(${fireColor} 20%, ${fireColorT} 70%)`,
              left,
              animationDelay: `${Math.random() * 1}s`,
              animationName: 'rise',
              animationDuration: '1s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              mixBlendMode: 'screen',
            }}
            key={index}
          ></div>
        );
      })}
    </div>
  );
}

export default Fire;
