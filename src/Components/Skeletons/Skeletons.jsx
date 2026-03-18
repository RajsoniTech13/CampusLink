export function PostSkeleton() {
  return (
    <div className="card p-4 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <div className="skeleton w-24 h-3 rounded" />
          <div className="skeleton w-16 h-2 rounded" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="skeleton w-full h-3 rounded" />
        <div className="skeleton w-3/4 h-3 rounded" />
      </div>
      <div className="skeleton w-full h-48 rounded-xl" />
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="skeleton w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton w-28 h-3 rounded" />
        <div className="skeleton w-40 h-2 rounded" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton w-full h-48 rounded-xl" />
      <div className="flex items-center gap-4 px-4">
        <div className="skeleton w-24 h-24 rounded-full -mt-12" />
        <div className="space-y-2 mt-2">
          <div className="skeleton w-32 h-4 rounded" />
          <div className="skeleton w-20 h-3 rounded" />
        </div>
      </div>
    </div>
  );
}

export function FriendSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="skeleton w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton w-28 h-3 rounded" />
        <div className="skeleton w-16 h-2 rounded" />
      </div>
      <div className="skeleton w-20 h-8 rounded-lg" />
    </div>
  );
}
