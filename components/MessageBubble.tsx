'use client';

interface Props {
  text: string;
  sender?: string;
  mine: boolean;
  status?: 'SENT' | 'DELIVERED' | 'SEEN';
  createdAt?: string;
}

export default function MessageBubble({
  text,
  sender,
  mine,
  status,
  createdAt,
}: Props) {
  return (
    <div
      className={`d-flex mb-3 ${
        mine ? 'justify-content-start' : 'justify-content-end'
      }`}
    >
      <div
        className={`p-3 rounded-4 shadow-sm ${
          mine ? 'bg-success text-white' : 'bg-white'
        }`}
        style={{
          maxWidth: '70%',
          minWidth: 120,
        }}
      >
        {!mine && (
          <div
            className="fw-bold mb-1"
            style={{
              fontSize: 13,
              color: '#0d6efd',
            }}
          >
            {sender}
          </div>
        )}

        <div>{text}</div>

        <div
          className="d-flex justify-content-end align-items-center mt-2"
          style={{
            gap: 6,
            fontSize: 11,
            opacity: 0.8,
          }}
        >
          <span>
            {createdAt
              ? new Date(createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </span>

          {mine && (
            <>
              {status === 'SENT' && (
                <i className="bi bi-check"></i>
              )}

              {status === 'DELIVERED' && (
                <i className="bi bi-check2-all"></i>
              )}

              {status === 'SEEN' && (
                <i
                  className="bi bi-check2-all"
                  style={{
                    color: '#34B7F1',
                  }}
                ></i>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}