export default function AdminLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-black"
    >
      <div className="size-10 animate-spin rounded-full border-4 border-[#E67E22] border-t-transparent" />
    </div>
  );
}
