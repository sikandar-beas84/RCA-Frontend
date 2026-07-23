type Props = {
  text: string;
  mine?: boolean;
};

export default function MessageBubble({
  text,
  mine,
}: Props) {
  return (
    <div
      className={`d-flex mb-3 ${
        mine ? 'justify-content-end' : 'justify-content-start'
      }`}
    >
      <div
        className={`p-3 rounded ${
          mine ? 'bg-primary text-white' : 'bg-light'
        }`}
        style={{
          maxWidth: '70%',
        }}
      >
        {text}
      </div>
    </div>
  );
}