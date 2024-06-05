"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";
import {useMemo} from "react";

interface PreviewProps {
    value: string;
}

export function Preview({value}:PreviewProps) {
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"),{ssr:false}), []);
    return(
            <ReactQuill
                theme="bubble"
                value={value}
                readOnly={true}
            />
    )
}
