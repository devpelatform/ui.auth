import { GridBackground } from '@pelatform/ui/animation';

export default function Page() {
  return (
    <div className="relative h-[calc(100vh-48px)] w-full overflow-hidden md:h-[calc(100vh-56px)]">
      <GridBackground gridSize="6:6">
        <div className="mx-auto flex h-full max-w-4xl flex-col items-center justify-center space-y-10 px-8">
          <h1 className="animate-fade-in bg-linear-to-r from-white via-purple-200 to-fuchsia-400 bg-clip-text text-center font-bold text-3xl text-transparent md:text-4xl">
            Welcome to The
            <br />
            <span className="bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Auth Starterkit
            </span>
          </h1>
          <p className="mx-auto max-w-lg animate-fade-in text-center text-lg text-purple-100">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsa, beatae possimus
            voluptates eius cumque quia velit unde pariatur obcaecati nobis quisquam libero
            consequuntur.
          </p>
        </div>
      </GridBackground>
    </div>
  );
}
