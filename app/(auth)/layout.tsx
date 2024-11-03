"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center ">
      <div className="w-4/5 sm:w-2/5 mt-20">{children}</div>
    </div>
  );
}
