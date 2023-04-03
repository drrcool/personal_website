import React, { useMemo } from "react";

const Test = ({ a: number, b: number }) => {
    const c = useMemo(() => a + b, [a, b]);
    return <div>{c}</div>;
};
