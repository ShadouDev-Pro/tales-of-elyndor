import { useEffect, useState } from "react";

export function useApi(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return { data, error };
}