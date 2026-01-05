function RideCard({ ride, onRequestSeat }) {
  return (
    <div className="card ride-card">
      <div className="ride-main">
        <div className="ride-route">
          <span className="city">{ride.from_text}</span>
          <span className="arrow">→</span>
          <span className="city">{ride.to_text}</span>
        </div>

        <div className="ride-meta">
          <span>{ride.date}</span>
          <span>•</span>
          <span>{ride.time}</span>
        </div>
      </div>

      <div className="ride-side">
        <div className="ride-seats">
          Seats: <strong>{ride.seats_available}</strong>
        </div>

        {ride.price_per_seat !== undefined && (
          <div className="ride-price">
            ₹{ride.price_per_seat}
          </div>
        )}

        {onRequestSeat &&
          ride.seats_available > 0 &&
          ride.status === "open" && (
            <button
              className="request-btn primary"
              onClick={() => onRequestSeat(ride.id)}
            >
              Request Seat
            </button>
          )}
      </div>
    </div>
  );
}

export default RideCard;
