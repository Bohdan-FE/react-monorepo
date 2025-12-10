import Header from './components/Header';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="fixed top-0 left-0 w-full h-screen">
        <div className="absolute inset-0 size-full bg-black/60 z-2"></div>
        <video
          src="/videos/video-bg.mp4"
          className=" object-cover size-full"
          autoPlay
          loop
          muted
        ></video>
      </div>

      <main className="min-h-screen  mx-auto relative z-3 ">{children}</main>
      {/* <footer className="h-[5rem]"></footer> */}
    </>
  );
}

export default Layout;
