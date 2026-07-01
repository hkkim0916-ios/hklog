"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const path = usePathname();

  return (
    <div style={styles.bar}>
      <TabItem href="/dashboard" active={path === "/dashboard"} icon="📊" label="홈" />
      <TabItem href="/plan" active={path === "/plan"} icon="📅" label="일정" />
      <TabItem href="/checklist" active={path === "/checklist"} icon="🧳" label="준비물" />
      <TabItem href="/map" active={path === "/map"} icon="🗺️" label="지도" />
    </div>
  );
}

function TabItem({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: string;
  label: string;
}) {
  return (
    <Link href={href} style={styles.item}>
      <div style={{ fontSize: 22, opacity: active ? 1 : 0.4 }}>
        {icon}
      </div>

      <div
        style={{
          fontSize: 11,
          marginTop: 2,
          color: active ? "#007aff" : "#999",
          fontWeight: active ? 600 : 400,
        }}
      >
        {label}
      </div>

      <div
        style={{
          width: 5,
          height: 5,
          marginTop: 3,
          borderRadius: "50%",
          background: active ? "#007aff" : "transparent",
        }}
      />
    </Link>
  );
}

const styles: any = {
  bar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(12px)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderTop: "1px solid #eee",
    zIndex: 1000,
  },

  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textDecoration: "none",
    flex: 1,
  },
};