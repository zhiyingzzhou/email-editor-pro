import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DynamicLayout from "./components/DynamicLayout";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "邮件模板编辑器",
  description: "专业的邮件模板编辑与发送管理平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <DynamicLayout>{children}</DynamicLayout>
        <Toaster />
      </body>
    </html>
  );
}
