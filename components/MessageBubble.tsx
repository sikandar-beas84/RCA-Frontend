interface Props {
  text: string;
  mine: boolean;
  sender?: string;
}

export default function MessageBubble({
  text,
  mine,
  sender,
}: Props) {
  return (
    <div
      className={`d-flex mb-2 ${
        mine
          ? 'justify-content-end'
          : 'justify-content-start'
      }`}
    >
      <div
        className={`p-3 rounded shadow-sm ${
          mine
            ? 'bg-primary text-white'
            : 'bg-white'
        }`}
        style={{
          maxWidth: '70%',
        }}
      >
        {/* Show sender name only for received messages */}
        {!mine && sender && (
          <small className="fw-bold d-block mb-1 text-primary">
            {sender}
          </small>
        )}

        {text}
      </div>
    </div>
  );
}