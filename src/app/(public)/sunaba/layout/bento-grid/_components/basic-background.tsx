"use client";

interface BasicBackgroundProps {
	className: string;
}

export const BasicBackground = ({ className }: BasicBackgroundProps) => (
	<div className={`absolute inset-0 bg-gradient-to-br ${className}`} />
);
