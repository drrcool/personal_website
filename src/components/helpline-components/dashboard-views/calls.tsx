import CallTimeSeries from "./calls/call-time-series";

const Calls = () => {
  return (
    <div className="m-4 flex flex-col gap-5">
      <div>Calls</div>
      <CallTimeSeries />
    </div>
  );
};

export default Calls;
