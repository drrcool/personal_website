import CallTimeSeries from "./calls/call-time-series";

const Calls = () => {
  return (
    <div className="m-4 flex flex-col gap-5 w-full">
      <div>Calls</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
        <CallTimeSeries />
      </div>
    </div>
  );
};

export default Calls;
