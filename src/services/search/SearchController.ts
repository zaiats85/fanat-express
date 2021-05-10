import { ParsedQs } from "qs";
import { getPlaces } from "./providers/OpenCageDataProvider";

/*@TODO set a return type*/
export const getPlacesByName = async (q: ParsedQs): Promise<any> => {
  const { query } = q;

  if (!query || Array.isArray(query) && (query.length < 3 || !query.length) ) {
    return {
      features: [],
      type: "FeatureCollection",
    };
  } else if (typeof query === "string") {
    return await getPlaces(query);
  }
};
