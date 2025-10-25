import useSWR from "swr";
import api from "../../../../api/axios";

const REFRESH_INTERVAL = 5000;

const fetcher = (url) =>
  api
    .get(url)
    .then((res) => res.data)
    .catch((err) => {
      if (err.response?.status === 404) return [];
      throw err;
    });

export const useQuotes = () => {
  const { data, error, isLoading } = useSWR("/quote", fetcher, {
    refreshInterval: REFRESH_INTERVAL,
    revalidateOnFocus: true,
  });

  return {
    quotes: data,
    error,
    isLoading,
    isEmpty: !data || data.length === 0,
  };
};
