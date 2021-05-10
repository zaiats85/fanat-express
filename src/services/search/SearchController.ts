import { ParsedQs } from "qs";
import { getPlaces } from "./providers/OpenCageDataProvider";

/*@TODO set a return type*/
export const getPlacesByName = async (query: ParsedQs): Promise<any> => {
  const { q: name } = query;
  console.log(query);

  if (!name || Array.isArray(name) && name.length < 3) {
    return {
      features: [],
      type: "FeatureCollection",
    };
  } else if (typeof name === "string") {
    return await getPlaces(name);
  }
};
