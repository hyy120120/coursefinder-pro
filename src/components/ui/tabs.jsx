'use client';

export function Tabs({ value, onValueChange, children }) {
  return <div>{children}</div>;
}

export function TabsList({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function TabsTrigger({ value, children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

export function TabsContent({ value, children }) {
  return <div>{children}</div>;
}
