import CallTimeSeries from "./calls/call-time-series";

const Calls = () => {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>Calls</div>
      <div className="grid grid-cols-2">
        <CallTimeSeries />
      </div>
    </div>
  );
};

export default Calls;
