import { Puff } from 'react-loader-spinner';
export default function Loader() {
  return (
    <div className="w-screen h-screen fixed z-50 flex flex-row items-center justify-center">
      <div className="absolute w-full h-full bg-black opacity-75"></div>
      <Puff height="40" width="40" color="white" wrapperClass="opacity-75" />
    </div>
  );
}
