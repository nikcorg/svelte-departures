export const fetchJSON = <T>(updateURL: string): Promise<T> =>
  fetch(updateURL, { mode: "cors" }).then(r => {
    if (!r.ok) {
      return Promise.reject(new Error(`error fetching json: ${r.status}`));
    }

    return r.json() as unknown as T;
  });
