interface IRide {
  _id: string;
  _index: string;
  _score: number;
  _source: any;
  _type: string;
}

const Rides = ({ rides }: { rides: IRide[] }) => (
  <div
    style={{
      width: "800px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
    data-test="list"
  >
    {rides.map((r: any) => (
      <div key={r._id} className="ride-unit">
        <div>{r._id}</div>
        <div style={{ marginLeft: 30, flex: 1 }}>{r._source.title}</div>
        <div style={{ background: r._color }} className="ride-color"></div>
      </div>
    ))}
  </div>
);

export default Rides;
