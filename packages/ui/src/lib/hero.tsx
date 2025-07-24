export function Hero(props: {
  title: string;
  subtitle: string;
  cta: string;
  onCtaClick?: () => void;
}) {
  return (
    <div
      style={{
        backgroundColor: '#1a1a2e',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '48px',
          marginBottom: '16px',
        }}
      >
        {props.title}
      </h1>
      <p
        style={{
          fontSize: '20px',
          marginBottom: '32px',
        }}
      >
        {props.subtitle}
      </p>
      <button
        onClick={props.onCtaClick}
        style={{
          backgroundColor: '#0066ff',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          fontSize: '18px',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {props.cta}
      </button>
    </div>
  );
}
